const fetch = require('node-fetch');

async function testBackend() {
    try {
        console.log('测试后端服务...');

        // 测试基础连接
        const response = await fetch('http://127.0.0.1:7001/api/blindboxes');
        console.log('盲盒列表接口状态:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('盲盒数量:', data.length);
        }

        // 测试订单接口
        const orderResponse = await fetch('http://127.0.0.1:7001/api/orders/user/1');
        console.log('订单接口状态:', orderResponse.status);

    } catch (error) {
        console.error('后端服务测试失败:', error.message);
    }
}

testBackend(); 