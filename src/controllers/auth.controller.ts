import { supabase } from '../config/supabase';

export const authController = {
  // Login เพื่อรับ JWT
  login: async ({ body, jwt, cookie, set }: any) => {
    try {
      const { username, password } = body;

      // 1. ค้นหา User
      const { data: admin, error: selectError } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .single();

      if (selectError || !admin) {
        set.status = 401;
        // ✅ แก้ไข: ส่ง JSON แทน throw Error
        return { 
          success: false,
          error: 'Invalid credentials',
          message: 'Username or password is incorrect'
        };
      }

      // 2. ตรวจสอบรหัสผ่าน (ใช้ Bun.password ที่มากับ Runtime)
      const isMatch = await Bun.password.verify(password, admin.password_hash);
      
      if (!isMatch) {
        set.status = 401;
        // ✅ แก้ไข: ส่ง JSON แทน throw Error
        return { 
          success: false,
          error: 'Invalid credentials',
          message: 'Username or password is incorrect'
        };
      }

      // 3. สร้าง Token
      const token = await jwt.sign({ 
        id: admin.id, 
        username: admin.username 
      });
      
      // 4. Set Cookie
      cookie.auth.set({
        value: token,
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // ✅ ส่ง JSON response
      return { 
        success: true, 
        message: 'Login successful',
        token: token // ส่ง token กลับไปด้วย
      };
      
    } catch (error) {
      console.error('Login error:', error);
      set.status = 500;
      // ✅ ส่ง JSON แทน throw Error
      return {
        success: false,
        error: 'Internal server error',
        message: String(error)
      };
    }
  },

  // Logout (ลบ Cookie)
  logout: ({ cookie, set }: any) => {
    try {
      cookie.auth.remove();
      return { 
        success: true, 
        message: 'Logged out successfully' 
      };
    } catch (error) {
      set.status = 500;
      return {
        success: false,
        error: 'Logout failed',
        message: String(error)
      };
    }
  },

  // เช็ค Profile ปัจจุบัน
  getProfile: ({ user }: any) => {
    return { 
      success: true,
      user 
    };
  }
};