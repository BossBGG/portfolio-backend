import { supabase } from '../config/supabase';

export const authController = {
  // Login เพื่อรับ JWT
  login: async ({ body, jwt, cookie, set }: any) => {
    const { username, password } = body;

    // 1. ค้นหา User
    const { data: admin } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single();

    if (!admin) {
      set.status = 401;
      throw new Error('Invalid credentials');
    }

    // 2. ตรวจสอบรหัสผ่าน (ใช้ Bun.password ที่มากับ Runtime)
    const isMatch = await Bun.password.verify(password, admin.password_hash);
    if (!isMatch) {
      set.status = 401;
      throw new Error('Invalid credentials');
    }

    // 3. สร้าง Token
    const token = await jwt.sign({ id: admin.id, username: admin.username });
    
    // 4. Set Cookie
    cookie.auth.set({
      value: token,
      httpOnly: true,
      secure: true,
      path: '/',
    });

    return { success: true, message: 'Login successful' };
  },

  // Logout (ลบ Cookie)
  logout: ({ cookie }: any) => {
    cookie.auth.remove();
    return { success: true, message: 'Logged out' };
  },

  // เช็ค Profile ปัจจุบัน
  getProfile: ({ user }: any) => {
    return { user };
  }
};