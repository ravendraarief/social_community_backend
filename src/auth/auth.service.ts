import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto'; 
import { LoginDto } from './dto/login.dto'; 
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
) {}

  async register(dto: RegisterDto) {
    const supabase = this.supabaseService.getClient();

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', dto.email)
      .single();

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Insert new user
    const { data, error } = await supabase.from('users').insert([
      {
        email: dto.email,
        username: dto.username,
        password_hash: hashedPassword,
      },
    ]).select().single();

    if (error) throw new BadRequestException(error.message);
    return { message: 'User registered successfully', user: data };
  }
  async login(dto: LoginDto) {
    const supabase = this.supabaseService.getClient();
  
    const { data: user, error } = await supabase
      .from('users')
      .select('user_id, email, username, password_hash')
      .eq('email', dto.email)
      .single();
  
    if (error || !user) throw new UnauthorizedException('Invalid email or password');
  
    const passwordMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!passwordMatch) throw new UnauthorizedException('Invalid email or password');
  
    const payload = { email: user.email, sub: user.user_id };
    const token = this.jwtService.sign(payload);
  
    return {
      message: 'Login successful',
      access_token: token,
      user,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const supabase = this.supabaseService.getClient();
  
    const { data, error } = await supabase
      .from('users')
      .update({
        bio: dto.bio,
        gender: dto.gender,
        birth_date: dto.birth_date,
      })
      .eq('user_id', userId)
      .select()
      .single();
  
    if (error) throw new BadRequestException(error.message);
  
    return { message: 'Profile updated successfully', user: data };
  }
  
  
}

