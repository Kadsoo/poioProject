const fetch = require('node-fetch');

async function testAPI() {
    try {
        console.log('测试修复后的API...');
        
        // 测试盲盒列表API
        const response = await fetch('http://127.0.0.1:7001/api/blindboxes?page=1&limit=12');
        
        console.log('状态码:', response.status);
        console.log('响应头:', response.headers);
        
        if (response.ok) {
            const data = await response.json();
            console.log('API正常:', data);
        } else {
            const errorText = await response.text();
            console.log('API错误:', errorText);
        }
        
    } catch (error) {
        console.error('连接失败:', error.message);
    }
}

testAPI(); 