function showSuccess(text){
	if(text) alert(text);
}
function showAlert(text){
	if(text) alert(text);
}
function sendRequest(el, act){
	var el = $(el);
	switch(act){
		case 'buy':
		var name = $('#'+act+'_name'), phone = $('#'+act+'_phone'), city = $('#'+act+'_city'), items = localStorage.getItem('items') || '[]';
		items = $.parseJSON(items);
		if(items.length){
		if(name.val()){
		if(phone.val()){
		if(city.val()){
		$.post('/request.php', {act: act, name: name.val(), phone: phone.val(), city: city.val(), items: items}, function(d){
		if(d){
		d = $.parseJSON(d);
		if(d.success){
		name.val('');
		phone.val('');
		city.val('');
		removeCart();
		showSuccess(d.success);
		} else if(d.error) showAlert(d.error);	
		} else showAlert('Неизвестная ошибка');
		});			
		} else city.focus();	
		} else phone.focus();	
		} else name.focus();
		} else showAlert('Не указаны товары');
		break;
		case 'feedback':
		var email = $('#'+act+'_email'), phone = $('#'+act+'_phone'), text = $('#'+act+'_text');
		if(email.val()){
		if(phone.val()){
		if(text.val()){
		$.post('/request.php', {act: act, email: email.val(), phone: phone.val(), text: text.val()}, function(d){
		if(d){
		d = $.parseJSON(d);
		if(d.success){
		email.val('');
		phone.val('');
		text.val('');
		showSuccess(d.success);
		} else if(d.error) showAlert(d.error);	
		} else showAlert('Неизвестная ошибка');
		});			
		} else text.focus();	
		} else phone.focus();	
		} else email.focus();
		break;
		case 'stock':
		var name = $('#'+act+'_name'), phone = $('#'+act+'_phone');
		if(name.val()){
		if(phone.val()){
		$.post('/request.php', {act: act, name: name.val(), phone: phone.val()}, function(d){
		if(d){
		d = $.parseJSON(d);
		if(d.success){
		name.val('');
		phone.val('');
		showSuccess(d.success);
		} else if(d.error) showAlert(d.error);	
		} else showAlert('Неизвестная ошибка');
		});				
		} else phone.focus();	
		} else email.focus();
		break;
		default:
	}
}
function addItem(param){
	var nowItems = localStorage.getItem('items') || '[]', nowItemsName = [];
	nowItems = $.parseJSON(nowItems);
	$.when($.each(nowItems, function(k,v){
	nowItemsName.push(v.name);	
	})).then(function(){
		if(nowItemsName.indexOf(param.name) == -1){
			param.quantity = 1;
			nowItems.push(param);
			localStorage.setItem('items', JSON.stringify(nowItems));
			reloadCart();
			// $('#cart_items_count').closest('.cart').removeClass('add');
			// $('#cart_items_count').closest('.cart').addClass('add');
			// setTimeout(function(){
			// $('#cart_items_count').closest('.cart').removeClass('add');	
			// }, 100);
		} else showAlert('Данный товар уже есть в корзине');
	});
	
}
function addQuantity(el){
	var el = $(el), thisName = el.closest('[data-item-name]').data('item-name'), nowItems = localStorage.getItem('items') || '[]', newItems = [];
	nowItems = $.parseJSON(nowItems);
	$.when($.each(nowItems, function(k,v){
	if(v.name == thisName) v.quantity++;
	newItems.push(v);	
	})).then(function(){
		localStorage.setItem('items', JSON.stringify(newItems));
		reloadCart();
	});
}
function delQuantity(el){
	var el = $(el), thisName = el.closest('[data-item-name]').data('item-name'), nowItems = localStorage.getItem('items') || '[]', newItems = [];
	nowItems = $.parseJSON(nowItems);
	$.when($.each(nowItems, function(k,v){
	if(v.name == thisName) v.quantity--;
	if(v.quantity > 0) newItems.push(v);	
	})).then(function(){
		localStorage.setItem('items', JSON.stringify(newItems));
		reloadCart();
	});
}
function delItem(el){
	var el = $(el), thisName = el.closest('[data-item-name]').data('item-name'), nowItems = localStorage.getItem('items') || '[]', newItems = [];
	nowItems = $.parseJSON(nowItems);
	$.when($.each(nowItems, function(k,v){
	if(v.name != thisName) newItems.push(v);	
	})).then(function(){
		localStorage.setItem('items', JSON.stringify(newItems));
		reloadCart();
	});
}
function removeCart(){
	localStorage.setItem('items', '');
	reloadCart();
}
function reloadCart(){
	var result = '', nowItems = localStorage.getItem('items') || '[]', fullPrice = 0, discount = 0, count = 0;
	nowItems = $.parseJSON(nowItems);
	$.when($.each(nowItems, function(k,v){
	price = v.price*v.quantity;
	count += v.quantity;
	fullPrice += price;
	if(v.image_id != 5 && v.image_id != 6){
	if (discount < 10) discount+= v.quantity;
	}
	result += `<tr data-item-name="${v.name}">
	<td class="text-center"><img src="img/products/product-${v.image_id}_min.png" alt=""></td>
	<td style="text-align: left; padding: 15px 8px !important;">${v.name}</td>
	<td title="Цена" class="hideSmallScreen">${v.price} грн</td>
	<td title="Количество"><button class="minusButton" onclick="delQuantity(this);">-</button><input readonly="" type="text" min="1" pattern="[0-9]" style="width: 70px;" class="my-product-quantity" value="${v.quantity}"><button class="plusButton" onclick="addQuantity(this);">+</button></td>
	<td title="Сумма" class="my-product-total">${price} грн</td>
	<td title="Удалить товар" class="text-center" style="width: 30px;" onclick="delItem(this);"><a href="javascript:void(0);" class="btn btn-xs my-product-remove"><img class="deleteTovarImg" src="img/close.png" alt=""></a></td>
	</tr>`;	
	})).then(function(){
		if (discount > 10) discount = 10;
		if (discount == 1) discount = 0;
		if (discount) fullPrice = fullPrice*((100-discount)/100);
		fullPrice = fullPrice.toFixed(2);
		html_discount = discount ? '<div style="text-align: left;color: green;">-'+discount+'%</div>' : '';
		result += `<tr style="background-color: transparent !important;">
	<td colspan="2" style="text-align: left; font-size: 18px;position: relative;">${html_discount}<div>Итого:<strong id="my-cart-grand-total">${fullPrice} грн</strong></div></td>
	<td colspan="2" class="smallHideCart" style="text-align: right; font-size: 18px;"><div class="close" onclick="$.magnificPopup.close();">Продолжить покупки</div></td>
	<td colspan="3" style="text-align: left; font-size: 18px" class="smallPaddingCart"><a href="#" class="my-cart-checkout" onclick="openSecondModal();">Подтвердить</a></td>
	</tr>`;
	if(count > 0){
		$('#cart_items_count').closest('.cart').addClass('add');
		$('#cart_items_count').css('display', 'block').text(count);
	} else {
		$('#cart_items_count').closest('.cart').removeClass('add');
		$('#cart_items_count').css('display', 'none').text('');
	}
	$('#my-cart-table tbody').html(result);
	$('#my-cart-grand-total2').text(fullPrice+' грн');
	});
}
function openSecondModal(){
	$.magnificPopup.close();
	setTimeout(function(){
	$('a[href="#popup-buy"]').trigger('click');
	}, 100);
}
$(function(){
if(window.page_modified_time != (localStorage.getItem('page_modified_time') || 0)){
localStorage.setItem('page_modified_time', window.page_modified_time);
removeCart();
} else reloadCart();
});