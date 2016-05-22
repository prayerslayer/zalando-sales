const priceRegex = /\d+,\d{2}/g;
const priceCss = ['.price', '.z-dz-price', 'catalogArticlesList_price'];

function calculatePrice(factor, price) {
    if (typeof price === 'string') {
        price = parseFloat(price.replace(",", "."));
    }
    return (price * factor).toFixed(2);
}

function traversePrices($prices, fn) {
    if (!$prices.length) {
        return;
    }
    $prices.each((idx, el) => {
        const $price = $(el);
        fn($price, idx);
        traversePrices($price.children());
    })
}

function makePricesGreatAgain() {
    var prices = $(document.body).find(priceCss.join(',')),
        salesFn = calculatePrice.bind(null, 0.6);

    traversePrices(prices, $el => {
        var oldText = $el.text(),
            newText = oldText.replace(priceRegex, match => salesFn(match));
        if (oldText !== newText) {
            $el.text("*" + newText);
            console.debug(oldText, "-->", newText)
        } else {
            console.debug(oldText, " = ", newText)
        }
    });
}

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
        setInterval(makePricesGreatAgain, 2000)
	}
	}, 10);
});