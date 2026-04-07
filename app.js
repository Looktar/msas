// 全局变量存储产品数据
let products = [];

// 页面加载完成后自动执行
window.onload = function() {
    console.log("程序已启动，开始加载数据...");
    loadProductData();
    loadNotice();
};

// --- 模块 1 & 3: 处理产品数据 (data.json) ---
function loadProductData() {
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error('无法读取 data.json，请检查文件是否存在');
            return response.json();
        })
        .then(data => {
            products = data.products;
            console.log('成功加载 ' + products.length + ' 个产品信息');
            // 数据加载成功后，立即渲染模块 3 的缺货清单
            renderOutOfStock();
        })
        .catch(error => {
            console.error('数据加载失败:', error);
            document.getElementById('outOfStock').innerText = "数据加载失败，请检查 data.json";
        });
}

// 模块 1: 价格查询函数
function searchProduct() {
    const input = document.getElementById('productCode').value.trim().toLowerCase();
    const resultDiv = document.getElementById('searchResult');
    
    if (!input) {
        resultDiv.innerHTML = '<span style="color:red;">请输入编号</span>';
        return;
    }

    const item = products.find(p => p.id.toLowerCase() === input);

    if (item) {
        const status = item.stock === "" ? "✅ 正常" : `⚠️ 缺货 (剩 ${item.stock})`;
        resultDiv.innerHTML = `
型号: ${item.id.toUpperCase()}
价格: $${item.price.toFixed(2)}
状态: ${status}
        `.trim();
    } else {
        resultDiv.innerHTML = `<span style="color:red;">未找到型号: ${input}</span>`;
    }
}

// 模块 3: 渲染缺货清单
function renderOutOfStock() {
    const display = document.getElementById('outOfStock');
    // 过滤出所有 stock 字段不为空的产品
    const oosItems = products.filter(p => p.stock !== "");

    if (oosItems.length === 0) {
        display.innerText = "目前所有产品库存正常。";
        return;
    }

    // 格式化显示缺货清单
    let content = oosItems.map(p => `• ${p.id.toUpperCase()}: 剩余 ${p.stock}`).join('\n');
    display.innerText = content;
}


// --- 模块 2: 处理留言板 (notice.txt) ---
function loadNotice() {
    // 加上时间戳防止浏览器缓存 txt 文件
    fetch('notice.txt?t=' + new Date().getTime())
        .then(response => {
            if (!response.ok) return "请新建 notice.txt 文件来显示留言。";
            return response.text();
        })
        .then(text => {
            const container = document.getElementById('notifications');
            if (container) {
                container.innerText = text;
            }
        })
        .catch(err => {
            console.error('留言板加载失败:', err);
        });
}