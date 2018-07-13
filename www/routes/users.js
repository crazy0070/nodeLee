var express = require('express');
var router = express.Router();
var request = require('request');
var rp = require('request-promise');

var totalKrw = 5000000;
var totalUsd = 0;
var coinList = new Array(); // 코인리스트
//원화마켓과 USDT 마켓 동시에 있는코인리스트
coinList = ['BTC','ETH','ADA','BCH','LTC','ETC','XRP','XMR','OMG','TRX','BTG','SC','ZEC','DASH','DCR'];


var coinResultList = new Array(); // 코인리스트
var coin = new Object(); // 코인객체
var krwusd = ''; //환율
var fee_A = 0.1 / 100; // 업비트 원화마켓 수수료
var fee_B = 0.25 / 100; // 업비트 원화마켓 외  수수료

coin.symbol='BTC';
coin.coinMarket='upbit';
coin.price_krw=1000;
coin.price_usd=1;
coin.satoshi=0.0001;
coin.premium=1.5;


var tikets  = new Array(); // 시세결과
var orderbooks  = new Array(); // 호가결과 

setInterval(getPremium ,3500);   

function getPremium(){
	var base_url;  
	coinResultList = new Array(); // 코인리스트

	/* 환율 */
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
	  param_market+= 'KRW-'+value+',USDT-'+value+',';
	});
	param_market =  param_market.substring(0,param_market.length-1);

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

		/*if(krw >= krw_usdt){
			var intDiff = krw - krw_usdt;
			var intPercent = intDiff / krw * 100;
    		coin.premium = intPercent.toFixed(2);
		}else{
			var intDiff = krw - krw_usdt;
			var intPercent = intDiff / krw * 100;
    		coin.premium = intPercent.toFixed(2);
		} */
		coinResultList.push(coin);		
	});

 	 
 	coinResultList.sort(function(a, b) { // 오름차순
	    return b.premium - a.premium ;
	    // 13, 21, 25, 44
	});


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
	console.log(coinResultList[0].price_krw +' '+ coinResultList[0].price_usd);
	console.log(orderbooks.length);

	orderbooks.forEach(function(result) {
		 	 
		if(coinResultList[0].symbol == result.market.split('-')[1]){ 
			if('KRW-'+coinResultList[0].symbol == result.market){
				for(var objVarName in result.orderbook_units) { 
					if(coinResultList[0].price_krw == result.orderbook_units[objVarName].ask_price.toFixed(2)){
						console.log('price:'+coinResultList[0].price_krw+' / ask_size:'+result.orderbook_units[objVarName].ask_size.toFixed(3));
					} 
				}
			} 
			if('USDT-'+coinResultList[0].symbol == result.market){ 
				for(var objVarName in result.orderbook_units) { 
					if( coinResultList[0].price_usd  == result.orderbook_units[objVarName].bid_price.toFixed(4)){
						console.log('price:'+coinResultList[0].price_usd+' / bid_size:'+result.orderbook_units[objVarName].bid_size.toFixed(3));
					} 
				}
			}
						 
		}		 
	}); 

	
	console.log(totalKrw+' / '+totalUsd);
}



/* GET users listing. */
router.get('/', function(req, res, next) {   
  //res.render('users', {'coins':coinResultList});
  res.json({'coins':coinResultList}); 
});

module.exports = router;
