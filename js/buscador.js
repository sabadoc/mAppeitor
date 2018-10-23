let mockData = [];
function initMockData() {
    for(let x = 0; x < 20000; x++) {
        mockData.push({
            id: x,
            name: 'Product  name index  ' + x,
            img: 'src/img/prueba/masimagenes/soloquierotenertextoqui.jpg',
            date: Date.now(),
            price: Math.random() * x,
            sku: Math.random()
        });
    }
}
function searchData(text) {
    console.log(mockData.find(text, function (return ) {
        
    }))
}