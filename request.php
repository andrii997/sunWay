<?php
$to_email = "ek@sunway.ua";
function mail_utf8($to, $from, $subject, $message) {
    $subject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $headers = "MIME-Version: 1.0\r";
    $headers.= "Content-type: text/plain; charset=utf-8\r";
    $headers.= "From: $from\r";
    return mail($to, $subject, $message, $headers);
}
$act = isset($_POST['act']) && !empty($_POST['act']) ? $_POST['act'] : false;
$response = [];
if ($act) {
    switch ($act) {
        case 'buy':
            $name = isset($_POST['name']) && !empty($_POST['name']) ? $_POST['name'] : false;
            $phone = isset($_POST['phone']) && !empty($_POST['phone']) ? $_POST['phone'] : false;
            $city = isset($_POST['city']) && !empty($_POST['city']) ? $_POST['city'] : false;
            $items = isset($_POST['items']) && !empty($_POST['items']) ? $_POST['items'] : false;
            if ($name) {
                if ($phone) {
                    if ($city) {
                        if ($items && is_array($items)) {
                            $discount = $price = 0;
                            $items2 = [];
                            foreach ($items as $k => $v) {
                                if (isset($v['name']) && !empty($v['name'])) {
                                    if (isset($v['price']) && !empty($v['price']) && $v['price'] >= 0) {
                                        if (isset($v['quantity']) && !empty($v['quantity']) && $v['quantity'] > 0) {
                                            $items2[] = $v['name'].' ('.$v['quantity'].' шт)';
                                            $price+= $v['quantity'] * $v['price'];
											if($v['image_id'] != 5 && $v['image_id'] != 6){
                                            if ($discount < 10) $discount+= $v['quantity'];
											}
                                        }
                                    }
                                }
                            }
                            if ($items2) {
                                $items2 = implode(",", $items2);
                                if ($discount > 10) $discount = 10;
								if ($discount == 1) $discount = 0;
								if ($discount) $price = $price*((100-$discount)/100);
								$price = number_format($price, 2, '.', '');
                                $html = <<<HTML
Имя клиента: {$name}
Номер телефона: {$phone}
Город: {$city}
Товары: {$items2}
Скидка: {$discount}%
Сумма к оплате: {$price} грн
HTML;
                                mail_utf8($to_email, $to_email, 'Заявка на покупку', $html);
								$response['success'] = 'Заявка отправлена';
                            } else $response['error'] = 'Не указаны товары';
                        } else $response['error'] = 'Не указаны товары';
                    } else $response['error'] = 'Не указан город';
                } else $response['error'] = 'Не указан номер';
            } else $response['error'] = 'Не указано имя';
            break;
        case 'feedback':
            $email = isset($_POST['email']) && !empty($_POST['email']) ? $_POST['email'] : false;
            $phone = isset($_POST['phone']) && !empty($_POST['phone']) ? $_POST['phone'] : false;
            $text = isset($_POST['text']) && !empty($_POST['text']) ? $_POST['text'] : false;
            if ($email) {
                if ($phone) {
                    if ($text) {
                        $html = <<<HTML
Электронный адрес: {$email}
Номер телефона: {$phone}
Сообщение: {$text}
HTML;
                        mail_utf8($to_email, $to_email, 'Заявка на обратную связь', $html);
						$response['success'] = 'Заявка отправлена';
                    }
                }
            }
            break;
			case 'stock':
            $name = isset($_POST['name']) && !empty($_POST['name']) ? $_POST['name'] : false;
            $phone = isset($_POST['phone']) && !empty($_POST['phone']) ? $_POST['phone'] : false;
            if ($name) {
                if ($phone) {
                        $html = <<<HTML
ФИО: {$name}
Номер телефона: {$phone}
HTML;
                        mail_utf8($to_email, $to_email, 'Заявка на участие в акции', $html);
						$response['success'] = 'Заявка отправлена';
                }
            }
            break;
        default:
        }
    } else $response['error'] = 'Действие не выбрано';
    echo json_encode($response);
?>