'use strict';

// Data
const account1 = {
  owner: 'Admiral Jay',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Tony Stark',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Bruce Wayne',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// creates username for all accounts.
const createUsernames = function(accs){
  for (const acc of accs){
    acc.username = acc.owner.toLowerCase().split(' ')
    .map(function(name){
        return name[0];
      })
      .join('');
  }
}

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

// displays the account activity on UI.
const displayMovements = function(movement){
  containerMovements.innerHTML = '';
  for (const [ind,ele] of movement.entries()){
    let type;
    if(ele > 0){
      type = "deposit";
    }
    else{
      type = "withdrawal";
    }
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${(ind+1)+ " " +type}</div>
        <div class="movements__value">${ele + '$'}</div>
    </div>
    `
    containerMovements.insertAdjacentHTML("afterbegin", html);
  }
}

const labelWelcome = document.querySelector('.welcome');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');

// computes the "IN", "OUT" and "INTEREST" of an user and displays on UI.
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(function(mov){
      return (mov > 0);
    })
    .reduce(function(acc,mov){
      return(acc+mov);
    })
  labelSumIn.textContent = `${incomes}$`;

  const out = acc.movements
    .filter(function(mov){
      return (mov < 0);
    })
    .reduce(function(acc,mov){
      return(acc+mov);
    })
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(function(mov){
      return(mov>0)
    })
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce(function(acc,int){
      return (acc+int);
    })
  labelSumInterest.textContent = `${interest}$`;
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}$`;
};

const UpdateUI = function(acc){
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
}

createUsernames(accounts);

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let curAccount;

// event handler for login button click.
btnLogin.addEventListener('click', function(e){
  e.preventDefault();
  curAccount = accounts.find(function(acc){
    return (acc.username == inputLoginUsername.value);
  });

  if(curAccount?.pin === Number(inputLoginPin.value)){
    labelWelcome.textContent = `Welcome back ${curAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;
    UpdateUI(curAccount);

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }
  else{
    labelWelcome.textContent = "Wrong credentials, try again!";
    containerApp.style.opacity = 0;
  }
});

// event handler for transfer button.
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(function(acc){
    return (acc.username == inputTransferTo.value);
  });

  if(amount > 0 && curAccount.balance > amount && curAccount && curAccount.username != receiverAcc.username){
    curAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    UpdateUI(curAccount);
  }

  inputTransferAmount.value = inputTransferTo.value = ' ';
  inputLoanAmount.blur();
});

// event handler for loan button
btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  
  if (amount > 0 && curAccount.movements.some(mov => mov >= amount * 0.1)){
    curAccount.movements.push(amount);
    UpdateUI(curAccount);
  }

  inputLoanAmount.value = '';
})

// event handler for close button.
btnClose.addEventListener('click',function(e){
  e.preventDefault();

  if(inputCloseUsername.value === curAccount.username && Number(inputClosePin.value) === curAccount.pin){
    const index = accounts.findIndex(function(){
      return (inputCloseUsername.value = curAccount.username);
    });

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
  }
})
