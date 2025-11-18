import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
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

  /**
   * REGISTER:
   * - Daftarkan user ke Supabase Auth -> Supabase kirim email verifikasi otomatis
   * - (Opsional) set username ke tabel public.users SETELAH row profil dibuat (oleh trigger)
   */
  async register(dto: RegisterDto) {
    const supabase = this.supabaseService.getClient();

    // Sign up langsung ke Supabase Auth (JANGAN insert ke public.users)
    const { data, error } = await supabase.auth.signUp({
  email: dto.email,
  password: dto.password,
  options: {
    emailRedirectTo: `${process.env.SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
    data: { username: dto.username }, // <— ini kunci
  },
});


    if (error) {
      // Supabase mengembalikan error kalau email sudah terdaftar
      // Pesan bisa "User already registered" atau serupa
      throw new BadRequestException(error.message || 'Failed to sign up');
    }

    // (Opsional) update username ke profil setelah trigger membuat barisnya
    if (data.user && dto.username) {
      await supabase
        .from('users')
        .update({ username: dto.username })
        .eq('user_id', data.user.id);
    }

    return {
      message: 'Registration successful. Please check your email to verify your account.',
    };
  }

  /**
   * LOGIN:
   * - Pakai Supabase Auth untuk verifikasi password
   * - Jika email belum terverifikasi (dan "Enable email confirmations" ON), Supabase akan tolak
   * - Kita tetap boleh terbitkan JWT internal untuk ekosistem NestJS-mu
   */
  async login(dto: LoginDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      // Handle khusus email belum verifikasi jika perlu
      const msg = error.message?.toLowerCase();
      if (msg?.includes('email not confirmed') || msg?.includes('email not verified')) {
        throw new UnauthorizedException('Email not verified. Please check your inbox.');
      }
      throw new UnauthorizedException('Invalid email or password');
    }

    const user = data.user!;

    // (Opsional) Terbitkan JWT milikmu sendiri
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    // Ambil profil publik
    const { data: profile } = await supabase
      .from('users')
      .select('user_id, email, username, bio, gender, birth_date, region_id, role_id, preference_id, social_point, social_badges, privacy_flag')
      .eq('user_id', user.id)
      .single();

    return {
      message: 'Login successful',
      access_token: accessToken,                       // JWT internal (opsional)
      supabase_access_token: data.session?.access_token, // kalau FE butuh
      user: profile ?? { user_id: user.id, email: user.email },
    };
  }

  /**
   * UPDATE PROFILE:
   * - Tetap update tabel public.users (tanpa password)
   */
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('users')
      .update({
        bio: dto.bio,
        gender: dto.gender,
        birth_date: dto.birth_date,
        region_id: dto.region_id,
        role_id: dto.role_id,
        preference_id: dto.preference_id,
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return { message: 'Profile updated successfully', user: data };
  }

  /**
   * (Bonus) Kirim ulang email verifikasi
   */
  async resendVerification(email: string) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${process.env.SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
      },
    });
    if (error) throw new BadRequestException(error.message);
    return { message: 'Verification email resent.' };
  }
}
