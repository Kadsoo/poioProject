const axios = require('axios');

const BASE_URL = 'http://localhost:7001';

async function testAPI() {
  console.log('开始测试API...\n');

  try {
    // 测试健康检查
    console.log('1. 测试健康检查...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ 健康检查成功:', healthResponse.data);

    // 测试API信息
    console.log('\n2. 测试API信息...');
    const apiInfoResponse = await axios.get(`${BASE_URL}/api-info`);
    console.log('✅ API信息获取成功:', apiInfoResponse.data);

    // 测试用户注册
    console.log('\n3. 测试用户注册...');
    const registerData = {
      username: 'testuser',
      password: '123456'
    };
    const registerResponse = await axios.post(`${BASE_URL}/user/register`, registerData);
    console.log('✅ 用户注册成功:', registerResponse.data);

    // 测试用户登录
    console.log('\n4. 测试用户登录...');
    const loginData = {
      username: 'testuser',
      password: '123456'
    };
    const loginResponse = await axios.post(`${BASE_URL}/user/login`, loginData);
    console.log('✅ 用户登录成功:', loginResponse.data);

    // 测试用户名检查
    console.log('\n5. 测试用户名检查...');
    const checkUsernameResponse = await axios.get(`${BASE_URL}/user/check-username/testuser`);
    console.log('✅ 用户名检查成功:', checkUsernameResponse.data);

    console.log('\n🎉 所有API测试通过！');

  } catch (error) {
    console.error('❌ API测试失败:', error.response?.data || error.message);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI }; 