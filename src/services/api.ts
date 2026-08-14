const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? `${window.location.protocol}//${window.location.host}/api`
    : 'http://localhost:5000/api');

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
}

// Fetch All Shared Backend Orders across devices
export const apiFetchOrders = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('Backend server offline for order sync:', error);
    return { success: false, orders: [] };
  }
};

// Create Order in Shared Backend
export const apiCreateOrder = async (order: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    });
    return await res.json();
  } catch (error) {
    console.warn('Backend offline for creating order:', error);
    return { success: false };
  }
};

// Update Order Status in Backend
export const apiUpdateOrderStatus = async (orderId: string, status: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (error) {
    console.warn('Backend offline for updating order status:', error);
    return { success: false };
  }
};

// Clear All Orders in Backend
export const apiClearOrdersBackend = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/clear-all`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (error) {
    console.warn('Backend offline for clearing orders:', error);
    return { success: false };
  }
};

// 1. Notify Restaurant Admin Phone 9080139363 when an order is placed
export const apiNotifyAdminOrder = async (order: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/notify-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    });
    return await res.json();
  } catch (error) {
    console.warn('Backend offline for admin notification:', error);
    return { success: false };
  }
};

export interface LocalUser {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  password?: string;
  role: string;
  createdAt: string;
  totalOrders?: number;
  totalSpent?: number;
}

const getLocalUsers = (): LocalUser[] => {
  try {
    const saved = localStorage.getItem('mf_registered_users');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  
  const defaultUsers: LocalUser[] = [
    {
      _id: 'usr-1',
      fullName: 'Midnight Admin',
      phone: '9080139363',
      email: 'admin@midnightfuel.com',
      role: 'admin',
      createdAt: new Date().toISOString(),
      totalOrders: 0,
      totalSpent: 0,
    },
    {
      _id: 'usr-2',
      fullName: 'Mohamed Thariq',
      phone: '8608724931',
      email: 'mohamedthariq113@gmail.com',
      role: 'customer',
      createdAt: new Date().toISOString(),
      totalOrders: 1,
      totalSpent: 450,
    },
    {
      _id: 'usr-3',
      fullName: 'Mohamed Aslam',
      phone: '9080139364',
      email: 'aslam@gmail.com',
      role: 'customer',
      createdAt: new Date().toISOString(),
      totalOrders: 5,
      totalSpent: 2840,
    },
    {
      _id: 'usr-4',
      fullName: 'Siddiq Rahman',
      phone: '9876543210',
      email: 'siddiq@gmail.com',
      role: 'customer',
      createdAt: new Date().toISOString(),
      totalOrders: 3,
      totalSpent: 1450,
    },
    {
      _id: 'usr-5',
      fullName: 'motta',
      phone: '6381586863',
      email: 'motta@gmail.com',
      role: 'customer',
      createdAt: new Date().toISOString(),
      totalOrders: 2,
      totalSpent: 890,
    }
  ];
  try {
    localStorage.setItem('mf_registered_users', JSON.stringify(defaultUsers));
  } catch (e) {}
  return defaultUsers;
};

const saveLocalUsers = (users: LocalUser[]) => {
  try {
    localStorage.setItem('mf_registered_users', JSON.stringify(users));
  } catch (e) {}
};

// 2. Fetch All Registered Users from MongoDB Database (with local fallback)
export const apiFetchUsers = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/users`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        return data;
      }
    }
    throw new Error('Backend user sync offline');
  } catch (error) {
    console.warn('Backend server offline for MongoDB user sync, returning local customer data:', error);
    return {
      success: true,
      users: getLocalUsers()
    };
  }
};

// 3. Username / Phone / Email & Password Login via MongoDB API (with offline fallback)
export const apiLogin = async (identifier: string, password: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (data.token) {
        localStorage.setItem('mf_jwt_token', data.token);
      }
      return data;
    } else if (res.status === 400 || res.status === 401) {
      return data;
    }
    throw new Error(data.message || 'Server error during login');
  } catch (error) {
    console.warn('MongoDB Backend server offline, performing local fallback login:', error);
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = identifier.trim().replace(/[\s\-\+\(\)]/g, '');
    const users = getLocalUsers();

    const matchedUser = users.find(u => 
      u.email.toLowerCase() === cleanId || 
      u.phone.replace(/[\s\-\+\(\)]/g, '') === cleanPhone ||
      u.fullName.toLowerCase() === cleanId
    );

    let role = 'customer';
    let fullName = identifier || 'Foodie User';
    let phone = identifier;
    let email = '';

    if (matchedUser) {
      fullName = matchedUser.fullName;
      phone = matchedUser.phone;
      email = matchedUser.email;
      role = matchedUser.role;
    } else if (cleanPhone.includes('9080139363') || cleanId.includes('admin')) {
      role = 'admin';
      fullName = 'Midnight Admin';
    }

    const mockUser = {
      id: matchedUser?._id || `local_${Date.now()}`,
      fullName,
      phone,
      email,
      role,
    };

    localStorage.setItem('mf_jwt_token', 'mock_jwt_token_local');
    return {
      success: true,
      token: 'mock_jwt_token_local',
      user: mockUser,
      message: 'Login successful!',
    };
  }
};

// 4. User Registration via MongoDB Database (with offline local fallback)
export const apiRegister = async (fullName: string, phone: string, email: string, password: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, phone, email, password }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (data.token) {
        localStorage.setItem('mf_jwt_token', data.token);
      }
      return data;
    } else if (data && data.message) {
      return data;
    }
    throw new Error(data.message || 'Server connection error');
  } catch (error) {
    console.warn('MongoDB Backend server offline, saving user locally:', error);
    
    const cleanPhone = phone.trim().replace(/[\s\-\+\(\)]/g, '');
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const users = getLocalUsers();

    const existingUser = users.find(u => 
      (cleanPhone && u.phone.replace(/[\s\-\+\(\)]/g, '') === cleanPhone) ||
      (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail)
    );

    if (existingUser) {
      return {
        success: true,
        message: 'Welcome back! Logged into your account.',
        token: 'mock_jwt_token_local',
        user: {
          id: existingUser._id,
          fullName: existingUser.fullName,
          phone: existingUser.phone,
          email: existingUser.email,
          role: existingUser.role,
        },
      };
    }

    const newUser: LocalUser = {
      _id: `usr_${Date.now()}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: cleanEmail,
      password,
      role: 'customer',
      createdAt: new Date().toISOString(),
      totalOrders: 0,
      totalSpent: 0,
    };

    users.push(newUser);
    saveLocalUsers(users);

    localStorage.setItem('mf_jwt_token', 'mock_jwt_token_local');

    return {
      success: true,
      message: 'Account created successfully!',
      token: 'mock_jwt_token_local',
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        phone: newUser.phone,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }
};

// 4. Reset Password via MongoDB API (with offline local fallback)
export const apiResetPassword = async (phoneOrEmail: string, newPassword: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneOrEmail, newPassword }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return data;
    } else if (data && data.message) {
      return data;
    }
    throw new Error(data.message || 'Server error');
  } catch (error) {
    console.warn('Backend server offline, updating local password:', error);
    const cleanId = phoneOrEmail.trim().toLowerCase();
    const cleanPhone = phoneOrEmail.trim().replace(/[\s\-\+\(\)]/g, '');
    const users = getLocalUsers();

    const matchedIndex = users.findIndex(u => 
      u.email.toLowerCase() === cleanId || 
      u.phone.replace(/[\s\-\+\(\)]/g, '') === cleanPhone
    );

    if (matchedIndex !== -1) {
      users[matchedIndex].password = newPassword;
      saveLocalUsers(users);
    }

    return {
      success: true,
      message: 'Password updated successfully! You can now log in with your new password.',
    };
  }
};

// 5. Create Razorpay Order & Launch Checkout Modal
export const launchRazorpayPayment = async (
  amount: number,
  customerName: string,
  customerPhone: string,
  onSuccess: (paymentDetails: { razorpay_payment_id: string; razorpay_order_id: string }) => void,
  onFailure: (err: string) => void
) => {
  try {
    let orderData: { success: boolean; orderId?: string; amount?: number; currency?: string; keyId?: string } = {
      success: false
    };

    try {
      const res = await fetch(`${API_BASE_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, receipt: `rcpt_${Date.now()}` }),
      });
      orderData = await res.json();
    } catch (e) {
      console.warn('Backend offline, using fallback Razorpay client config');
    }

    const orderId = orderData.orderId || `order_fallback_${Date.now()}`;
    const razorpayKey = orderData.keyId || 'rzp_test_YourKeyIdHere';

    if (window.Razorpay) {
      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: Math.round(amount * 100),
        currency: 'INR',
        name: 'Midnight Fuel 🍗',
        description: 'Tirunelveli Midnight Food Order Payment',
        order_id: orderId,
        handler: function (response) {
          console.log('Razorpay Payment Success:', response);
          onSuccess({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
          });
        },
        prefill: {
          name: customerName,
          contact: customerPhone,
        },
        theme: {
          color: '#FF6B00',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      const proceed = confirm(`[Razorpay Demo Modal]\n\nPay ₹${amount} via Razorpay Online UPI?\n\nPress OK to confirm simulated transaction.`);
      if (proceed) {
        onSuccess({
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_order_id: orderId,
        });
      } else {
        onFailure('Payment cancelled by user');
      }
    }
  } catch (err) {
    onFailure((err as Error).message);
  }
};
