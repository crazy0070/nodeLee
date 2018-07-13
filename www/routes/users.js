var express = require('express');
var router = express.Router();
var request = require('request');
var rp = require('request-promise');

var totalKrw = 5000000;
var totalUsd = 0;
var totalBtc = 0;
var coinList = new Array(); // 코인리스트
//원화마켓과 USDT 마켓 동시에 있는코인리스트
//coinList = ['ETH','ADA','BCH','LTC','ETC','XRP','XMR','OMG','TRX','BTG','SC','ZEC','DASH','DCR'];
//coinList = ['EOS-','ADA','TRX','ETH','POWR','XRP','ZIL-','ETC','STORM','SNT','BCH','SC','NEO','LOOM-','GTO','QTUM','ICX-','ONT-',
//'GRS','ZRX','MCO','XLM','STEEM','OMG','SBD','KMD','SRN','IGNIS','XEM','LTC','POLY','DASH','BTG','ARDR','PIVX','MTL-','REP','TIX',
//'MER','ARK','STRAT','XMR','STORJ','DCR','VTC','WAVES','LSK','ZEC'];
coinList = ['ADA','TRX','ETH','POWR','XRP','ETC','STORM','SNT','BCH','SC','NEO','GTO','QTUM','GRS','ZRX','MCO','XLM','STEEM','OMG','SBD','KMD','SRN','IGNIS','XEM','LTC','POLY','DASH','BTG','ARDR','PIVX','REP','TIX','MER','ARK','STRAT','XMR','STORJ','DCR','VTC','WAVES','LSK','ZEC'];

var coinResultList = new Array(); // 코인리스트
var coinResultList2 = new Array(); // 코인리스트

var coin = new Object(); // 코인객체
var coin2 = new Object(); // 코인객체
var krwusd = ''; //환율
var krwbtc = ''; 
var fee_A = 0.0005 / 100; // 업비트 원화마켓 수수료
var fee_B = 0.0025 / 100; // 업비트 원화마켓 외  수수료

coin.symbol='BTC';
coin.coinMarket='upbit';
coin.price_krw=1000;
coin.price_usd=1;
coin.satoshi=0.0001;
coin.premium=1.5;
 
var tikets  = new Array(); // 시세결과
var orderbooks  = new Array(); // 호가결과 

setInterval(getPremium ,1000);   

function getPremium(){
	var base_url;  
	coinResultList = new Array(); // 코인리스트
	coinResultList2 = new Array();
	// 환율 //
	base_url ='https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD'; 
	var options = {
		uri: base_url, 
	    headers: {
	        'User-Agent': 'Request-Promise'
	    },
	    json: true // Automatically parses the JSON string in the response
	};
	rp(options)
	.then(function (repos) {  	    	
		krwusd = repos[0].basePrice;    
	})
	.catch(function (err) {
	//    console.log(err);
	});


	var param_market = '';
	coinList.forEach(function(value) {
	  param_market+= 'KRW-'+value+',BTC-'+value+',';
	});
	param_market =  param_market.substring(0,param_market.length-1);


/*
	// 업비트 원화&USDT 시세 
	base_url ='https://api.upbit.com/v1/ticker'; 
	var options = {
		uri: base_url, 
		qs: {markets:param_market},
	    headers: {
	        'User-Agent': 'Request-Promise'
	    },
	    json: true // Automatically parses the JSON string in the response
	};  
	rp(options)
	.then(function (repos) {  
		tikets = repos;  
	})
	.catch(function (err) {
	//    console.log(err);
	});
 	
 	coinList.forEach(function(value) { 	 
		coin = new Object(); 

		coin.symbol=value;
		coin.exchange='upbit'; 		

		tikets.forEach(function(result) {
			if(value == result.market.split('-')[1]){ 
				if('KRW' == result.market.split('-')[0]){
					coin.price_krw=result.trade_price.toFixed(2);
				}else if('USDT' == result.market.split('-')[0]){
					coin.price_usd =result.trade_price.toFixed(4);
				}
			}		 
		}); 
		var krw = coin.price_krw;
		coin.price_krw_usd = (coin.price_usd * krwusd).toFixed(2);		
		var krw_usd = coin.price_krw_usd;		
		var intDiff = krw - krw_usd;
		var intPercent = intDiff / krw * 100;
		coin.premium = intPercent.toFixed(2); 
		coinResultList.push(coin);		
	});

 	 
 	coinResultList.sort(function(a, b) { // 오름차순
	    return b.premium - a.premium ;
	    // 13, 21, 25, 44
	});

*/
/*
	// 업비트 원화&USDT 시세 
	base_url ='https://api.upbit.com/v1/orderbook';  
	var options = {
		uri: base_url, 
		qs: {markets:param_market},
	    headers: {
	        'User-Agent': 'Request-Promise'
	    },
	    json: true // Automatically parses the JSON string in the response
	};  
	rp(options)
	.then(function (repos) {  
		tikets = repos;  
	})
	.catch(function (err) {
	//    console.log(err);
	});
 	
 	coinList.forEach(function(value) { 	 
		coin = new Object(); 

		coin.symbol=value; 	

		tikets.forEach(function(result) {
			if(value == result.market.split('-')[1]){ 
				if('KRW' == result.market.split('-')[0]){  
					//원화 판매가 최저금액
					coin.price_ask_krw = result.orderbook_units[0].ask_price;
					coin.price_ask_krw_size = result.orderbook_units[0].ask_size;
					coin.price_ask_krw_total = (coin.price_ask_krw * coin.price_ask_krw_size).toFixed(2);
					
					//원화 구매 최고금액
					coin.price_bid_krw = result.orderbook_units[0].bid_price;
					coin.price_bid_krw_size = result.orderbook_units[0].bid_size;
					coin.price_bid_krw_total = (coin.price_bid_krw * coin.price_bid_krw_size).toFixed(2);
				}else if('USDT' == result.market.split('-')[0]){
					//USDT 판매가 최저금액 
					coin.price_ask_usd = result.orderbook_units[0].ask_price.toFixed(4);
					coin.price_ask_usd_size = result.orderbook_units[0].ask_size;
					coin.price_ask_usd_total = (coin.price_usd * coin.price_usd_size).toFixed(2);
					
					//USDT 구매가 최고금액 
					coin.price_bid_usd = result.orderbook_units[0].bid_price.toFixed(4);
					coin.price_bid_usd_size = result.orderbook_units[0].bid_size;
					coin.price_bid_usd_total = (coin.price_bid_usd * coin.price_bid_usd_size).toFixed(2);
				}
			}		 
		}); 
		var krw = coin.price_ask_krw;
		//구매가 최고액 달러를 원화로 변환
		coin.price_bid_krwusd = (coin.price_bid_usd * krwusd).toFixed(2);		
		var krw_usd = coin.price_bid_krwusd;		
		var intDiff = krw - krw_usd;
		var intPercent = intDiff / krw * 100;
		coin.premium = intPercent.toFixed(2); 
		coinResultList.push(coin);		
	});

 	 
 	coinResultList.sort(function(a, b) { // 오름차순
	    return b.premium - a.premium ;
	    // 13, 21, 25, 44
	});
*/
	
	// 비트코인 현재 시세 
	base_url ='https://api.upbit.com/v1/ticker?markets=KRW-BTC'; 
	var options = {
		uri: base_url,  
	    headers: {
	        'User-Agent': 'Request-Promise'
	    },
	    json: true // Automatically parses the JSON string in the response
	};  
	rp(options)
	.then(function (repos) {  	 
		krwbtc = repos[0].trade_price;  
	})
	.catch(function (err) {
	//    console.log(err);
	});


 
	// 업비트 원화&USDT 시세 
	base_url ='https://api.upbit.com/v1/orderbook';  
	var options = {
		uri: base_url, 
		qs: {markets:param_market},
	    headers: {
	        'User-Agent': 'Request-Promise'
	    },
	    json: true // Automatically parses the JSON string in the response
	};  
	rp(options)
	.then(function (repos) {  
		tikets = repos;  
	})
	.catch(function (err) {
	//    console.log(err);
	}); 
 	
 	coinList.forEach(function(value) { 	 
		coin = new Object();
		coin2 = new Object(); 

		coin.symbol=value; 
		coin2.symbol=value; 	

		tikets.forEach(function(result) {			 
			if(value == result.market.split('-')[1]){				 
				if('KRW' == result.market.split('-')[0]){  
					//원화 판매가 최저금액
					coin.price_ask_krw = result.orderbook_units[0].ask_price;
					coin.price_ask_krw_size = result.orderbook_units[0].ask_size;
					coin.price_ask_krw_total = (coin.price_ask_krw * coin.price_ask_krw_size).toFixed(2);
					
					//원화 구매 최고금액
					coin2.price_bid_krw = result.orderbook_units[0].bid_price;
					coin2.price_bid_krw_size = result.orderbook_units[0].bid_size;
					coin2.price_bid_krw_total = (coin2.price_bid_krw * coin2.price_bid_krw_size).toFixed(2);
				}else if('BTC' == result.market.split('-')[0]){
					//BTC 판매가 최저금액 
					coin2.price_ask_btc = result.orderbook_units[0].ask_price ;
					coin2.price_ask_btckrw = result.orderbook_units[0].ask_price * krwbtc;
					coin2.price_ask_btc_size = result.orderbook_units[0].ask_size;
					coin2.price_ask_btc_total = (coin2.price_ask_btc * coin2.price_ask_btc_size * krwbtc).toFixed(2) ;
					
					//BTC 구매가 최고금액 
					coin.price_bid_btc = result.orderbook_units[0].bid_price;
					coin.price_bid_btckrw = result.orderbook_units[0].bid_price * krwbtc;
					coin.price_bid_btc_size = result.orderbook_units[0].bid_size;
					coin.price_bid_btc_total = (coin.price_bid_btc * coin.price_bid_btc_size * krwbtc).toFixed(2) ;
				}					
			}
					 
		}); 
		var krw = coin.price_ask_krw;
		//구매가 최고액 비트를 원화로 변환
		coin.price_bid_krwbtc = coin.price_bid_btc * krwbtc; 	
		var krw_btc = coin.price_bid_krwbtc;		
		var intDiff = krw - krw_btc;
		var intPercent = intDiff / krw * 100;
		coin.premium = intPercent.toFixed(2);

		coinResultList.push(coin);	

		krw = coin2.price_bid_krw;
		//판매가 최저액 비트를 원화로 변환
		coin2.price_ask_krwbtc = coin2.price_ask_btc * krwbtc; 	
		krw_btc = coin2.price_ask_krwbtc;
		intDiff =   krw -  krw_btc;
		intPercent = intDiff / krw * 100;
		coin2.premium = intPercent.toFixed(2);
		coinResultList2.push(coin2);	
	});

 	 
 	coinResultList.sort(function(a, b) { // 오름 차순
	    return a.premium - b.premium ;
	    // 13, 21, 25, 44
	});

	coinResultList2.sort(function(a, b) { // 내림 차순
	    return b.premium - a.premium ;
	    // 13, 21, 25, 44
	});


 	//보유원화, 원화-구매총액, 비트-판매총액, 보유비트, 비트-구매총액, 원화-판매총액 

 	// 보유 원화 > 구매총액 && 판매총액 > 구매총액
 	
 	var price = new Array();

 	//원화로 구매가능한 총액
 	var bid_krw_total = coinResultList[coinResultList.length-1].price_ask_krw_total; 
 	//비트로 판매가능한 총액
 	var ask_bit_total = coinResultList[coinResultList.length-1].price_bid_btc_total;
 	

 	//비트로 구매가능한 총액 
 	var bid_bit_total = coinResultList2[0].price_ask_btc_total; 
 	//원화로 판매가능한 총액
 	var ask_krw_total = coinResultList2[0].price_bid_krw_total;

 	var avail = '';
 	price.push(bid_krw_total);
 	price.push(ask_bit_total);
 	price.push(bid_bit_total);
 	price.push(ask_krw_total);

 	price.sort(function(a, b) { // 오름차순
	    return a - b ;
	    // 13, 21, 25, 44
	});
 	avail = price[0];

 	console.log('보유 원화 '+totalKrw) ;	
	console.log('원화마켓 구매코인 '+coinResultList[coinResultList.length-1].symbol); 
	console.log('원화로 구매가능한 총액: '+bid_krw_total) ;
	console.log('비트로 판매가능한 총액: '+ask_bit_total) ;

	console.log('BTC 마켓 구매코인 '+coinResultList[0].symbol); 
	console.log('비트로 구매가능한 총액 : '+bid_bit_total) ;
	console.log('원화로 판매가능한 총액: '+ask_krw_total) ;  

	console.log('최대 거래금액 '+avail) ;
	
	//거래금액보다 보유 원화가 있어야 함.
	var size ='';
	if(totalKrw > avail){
		size = (   / coinResultList[coinResultList.length-1].price_ask_krw).toFixed(8);
		console.log('size::'+size);
	} 
	size * 
	console.log(totalKrw+' / '+totalBtc);


/*
	// 업비트 원화&USDT 호가 정보	
	base_url ='https://api.upbit.com/v1/orderbook'; 
	var options = {
		uri: base_url, 
		qs: {markets:param_market},
	    headers: {
	        'User-Agent': 'Request-Promise'
	    },
	    json: true // Automatically parses the JSON string in the response
	};  
	rp(options)
	.then(function (repos) {  
		orderbooks = repos;  
	})
	.catch(function (err) {
	//    console.log(err);
	});
 
	console.log(coinResultList[0].symbol);
	console.log('체결가:::'+coinResultList[0].price_krw +' '+ coinResultList[0].price_usd);

	orderbooks.forEach(function(result) {
		 	 
		if(coinResultList[0].symbol == result.market.split('-')[1]){ 
			if('KRW-'+coinResultList[0].symbol == result.market){
				for(var objVarName in result.orderbook_units) { 
					if(coinResultList[0].price_krw == result.orderbook_units[objVarName].ask_price.toFixed(2)){
						console.log('판매 price:'+result.orderbook_units[objVarName].ask_price+' / ask_size:'+result.orderbook_units[objVarName].ask_size.toFixed(3));
					} 
				}
			} 
			if('USDT-'+coinResultList[0].symbol == result.market){ 
				for(var objVarName in result.orderbook_units) { 
					if( coinResultList[0].price_usd  == result.orderbook_units[objVarName].bid_price.toFixed(4)){
						console.log('구매 price:'+result.orderbook_units[objVarName].bid_price+' / bid_size:'+result.orderbook_units[objVarName].bid_size.toFixed(3));
					} 
				}
			}
						 
		}		 
	}); 

*/	
 	
 	
}



/* GET users listing. */
router.get('/', function(req, res, next) {   
  //res.render('users', {'coins':coinResultList});
  res.json({'coins':coinResultList,'coins2':coinResultList2}); 
});

module.exports = router;
