const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('🔐 Probando login...');
    
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('✅ LOGIN EXITOSO!');
    console.log('Usuario:', response.data.data.user.nombre_completo);
    console.log('Perfil:', response.data.data.user.perfil.nombre_perfil);
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data?.message || error.message);
  }
};

testLogin();
