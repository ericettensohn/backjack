
// when the user clicks deal - deal

	var theDeck = [];
	var playersHand = [];
	var dealersHand = [];
	var topOfTheDeck = 4;
	var dealerTotal = 0;
	var playerTotal = 0;

	var playerScore = 0;
	var dealerScore = 0;

	var bet = 0;
	var balance = 100;

$(document).ready(function() {

	
	$(function () {
  		$('[data-toggle="popover"]').popover()
	})

	$(".deal-button").click(function(){
		createDeck(); // create array of 1H-13c
		shuffleDeck();

		playersHand.push(theDeck[0]);
		placeCard('player', 'one', theDeck[0]);
		
		dealersHand.push(theDeck[1]);
		placeCard('dealer', 'one', theDeck[1]);
		
		playersHand.push(theDeck[2]);
		placeCard('player', 'two', theDeck[2]);
		
		dealersHand.push(theDeck[3]);
		placeCard('dealer', 'two', theDeck[3]);
		$('.dealer-cards .card-two').addClass('card-reverse');
		$('.dealer-cards .card-two').addClass("hidden-text")
		$('.dealer-cards .card-two').children().hide();

		calculateTotal(playersHand, "player");
		calculateTotal(dealersHand, "dealer");

		$('.deal-button').prop("disabled", "true");
		$('.bet-add').prop("disabled", true);
		$('.bet-subtract').prop("disabled", true);
		$('.bet-add-10').prop("disabled", true);
		$('.bet-subtract-10').prop("disabled", true);

	}); // deal button listener

	$(".hit-button").click(function(){
		// placeCard('player', 'three', theDeck[4])
		var slot = '';
		if(playersHand.length == 2) {
			slot = "three";
		}
		else if (playersHand.length == 3) {
			slot = "four";
		}
		else if (playersHand.length == 4) {
			slot = "five";
		}
		else if (playersHand.length == 5) {
			slot = "six";
		}

		if (playersHand.length < 6) {
			placeCard('player', slot, theDeck[topOfTheDeck]);
			playersHand.push(theDeck[topOfTheDeck]);
			calculateTotal(playersHand, 'player');
			topOfTheDeck ++;
		}
		if (playerTotal >= 21) {
			checkWin()
		}

	}); // hit button listener

	$(".stand-button").click(function(){
		var slot = '';
		dealerTotal = calculateTotal(dealersHand, 'dealer');
		while(dealerTotal < 17) {
			if(dealersHand.length == 2) {
				slot = "three";
			}
			else if(dealersHand.length == 3) {
				slot = "four";
			} 
			else if(dealersHand.length == 4) {
				slot = "five";
			}
			else if(dealersHand.length == 5) {
				slot = "six";
			}
			placeCard('dealer', slot, theDeck[topOfTheDeck]);
			dealersHand.push(theDeck[topOfTheDeck]);
			dealerTotal = calculateTotal(dealersHand, 'dealer');
			topOfTheDeck++;
		}
		$('.dealer-cards .card-two').removeClass('card-reverse');
		$('.dealer-cards .card-two').removeClass("hidden-text")
		$('.dealer-cards .card-two').children().show();

		$('.dealer-total-number').addClass('fade-in-post');

		// dealer has at least 17, check to see who won
		checkWin();

	}); // stand button listener

	$('.reset-button').click(function() {
		theDeck = [];
		playersHand = [];
		dealersHand = [];
		topOfTheDeck = 4;
		dealerTotal = 0;
		playerTotal = 0;
		bet = 0;

		$('.player-total-number').text(playerTotal);
		$('.dealer-total-number').removeClass('fade-in-post');
		$('.dealer-total-number').text(dealerTotal);

		$('.card').removeClass('red');
		$('.card').removeClass('black');
		$('.card').addClass('wait');

		$('.card').text('');

		$('.reset-button').removeClass('slide')

		$(".dealer-total-number").popover('destroy');
		$(".player-total-number").popover('destroy');

		$('.deal-button').prop("disabled", false);
		$('.bet-add').prop("disabled", false);
		$('.bet-subtract').prop("disabled", false);
		$('.bet-add-10').prop("disabled", false);
		$('.bet-subtract-10').prop("disabled", false);


	});

	$('.bet-add').click(function() {
		if (balance > 0) {
			bet++;
			$('.bet-amount').text(bet);
			balance--;

			$('.balance').text(balance);
		}
	});

	$('.bet-subtract').click(function() {
		if (bet > 0) {
			balance++
			bet--;
		}
		
		$('.bet-amount').text(bet)
		$('.balance').text(balance)
	});

	$('.bet-add-10').click(function() {
		
		if (balance > 9) {
			bet += 10;
			$('.bet-amount').text(bet)
			balance -= 10;

			$('.balance').text(balance)
		}
	});

	$('.bet-subtract-10').click(function() {
		if (bet > 0) {
			balance += 10;
			bet -= 10;
		}
		
		$('.bet-amount').text(bet)
		$('.balance').text(balance)
	});

});

function checkWin() {

	var result;

	if(playerTotal > 21) {
		// player has busted
		result = "Player bust!"
		$('.player-total-number').attr("data-content", result)
		$(".player-total-number").popover('show');
		$('.dealer-cards .card').addClass('border-green')
		
		// $('.dealer-cards').addClass('border-green');
		dealerScore++;

	}
	else if (dealerTotal > 21) {
		// dealer has busted
		result = "Dealer bust!"
		$('.dealer-total-number').attr("data-content", result)
		$(".dealer-total-number").popover('show');
		playerScore++
		balance += (bet * 2);
	}
	else {
		// neither player has more than 21
		if(playerTotal > dealerTotal) {
			// player won
			result = "Player win!"
			$('.player-total-number').attr("data-content", result)
			$(".player-total-number").popover('show');
			playerScore++
			balance += (bet * 2);
		}
		else if (dealerTotal > playerTotal) {
			// dealer won
			result = "Dealer win!"
			$('.dealer-total-number').attr("data-content", result)
			$(".dealer-total-number").popover('show');
			dealerScore++;
		}
		else {
			// tie
			result = "tie";
			$('.player-total-number').attr("data-content", result)
			$('.dealer-total-number').attr("data-content", result)
			$(".player-total-number").popover('show');
			$(".dealer-total-number").popover('show');
			
		}
	}
	
	if (result !== '') {
		
		$('.dealer-total-number').addClass('fade-in-post');

	}

	$('.balance').text(balance)
	$('.dealer-score').text(dealerScore);
	$('.player-score').text(playerScore);

	$('.dealer-cards .card-two').removeClass('card-reverse');
	$('.dealer-cards .card-two').removeClass("hidden-text")
	$('.dealer-cards .card-two').children().show();

	$('.reset-button').removeClass('hidden')
	$('.reset-button').addClass('slide')

	$('.bet-amount').text('0')

	return result;
}

function placeCard(who, where, cardToPlace) {
	var classSelector = '.' + who + '-cards .card-' + where;

	var cardPass = cardToPlace.slice(0, -1);

	if (cardPass == 11) {
		cardPass = "J"
	} else if (cardPass == 12) {
		cardPass = "Q"
	} else if (cardPass == 13) {
		cardPass = "K"
	} else if (cardPass == 1) {
		cardPass = "A"
	}

	$(classSelector).html(cardPass);
	$(classSelector).removeClass('card-reverse')
	$(classSelector).removeClass('wait')

	if (cardToPlace.indexOf('h') > -1) {
		$(classSelector).append('<img src="img/heart.jpg">');
		$(classSelector).addClass("red")
	} else if (cardToPlace.indexOf('s') > -1) {
		$(classSelector).append('<img src="img/spade.jpg">');
		$(classSelector).addClass("black")
	} else if (cardToPlace.indexOf('c') > -1) {
		$(classSelector).append('<img src="img/club.jpg">');
		$(classSelector).addClass("black")
	} else if (cardToPlace.indexOf('d') > -1) {
		$(classSelector).append('<img src="img/diamond.jpg">');
		$(classSelector).addClass("red")
	}

}

function createDeck() {
	// Fill deck with 52 cards, 4 suits (h, s, d, c)
	var suits = ['h', 's', 'd', 'c']
	for (var s = 0; s < suits.length; s++) {
		for (var c = 1; c <= 13; c++) {
			theDeck.push(c + suits[s]);
		}
	}
}

function shuffleDeck() {
	for (var i = 1; i < 1000; i++) {
		card1 = Math.floor(Math.random() * theDeck.length);
		card2 = Math.floor(Math.random() * theDeck.length);
		var temp = theDeck[card1];
		theDeck[card1] = theDeck[card2];
		theDeck[card2] = temp;
	}
}

function calculateTotal(hand, whosTurn) {
	var cardValue = 0;
	var total = 0;
	var hasAce = false;
	
	for(var i = 0; i < hand.length; i++) {
		cardValue = Number(hand[i].slice(0, -1))

		if((cardValue == 1) && ((total + 11) <= 21)) {
			cardValue = 11;
			hasAce = true;
		}
		else if(cardValue > 10) {
			cardValue = 10;
		}
		else if((cardValue + total > 21) && (hasAce)) {
			total -= 10;
			hasAce = false
		}
	
		total += cardValue;
	
		if (whosTurn == 'player') {
			playerTotal = total;
		}
	}

	// set player OR dealer total number
	var elementToUpdate = '.' + whosTurn + '-total-number';
	$(elementToUpdate).html(total);
	return total;
}

