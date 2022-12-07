// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
 
  fruitsList.innerHTML = "";
  let countIndex = 0;
  for (let i = 0; i < fruits.length; i++) {
    const newLi = document.createElement("li");
    const newDiv = document.createElement("div");
    newDiv.className = "fruit__info";
    newLi.appendChild(newDiv);

    let divCount = document.createElement('div');
    divCount.innerHTML = "index: " + `${countIndex}`;
    newDiv.appendChild(divCount); 
    countIndex ++;

    let fruit = fruits[i];    
    for (let entr of Object.entries(fruit)){
      let div = document.createElement('div');
      (entr[0] == "weight")? div.innerHTML = entr[0] + "(кг): " + entr[1] : div.innerHTML = entr[0] + ": " + entr[1];
      newDiv.appendChild(div);  
      let cl;

      switch (fruit.color){
        case 'красный': 
          cl = 'red';
          break;
        case 'оранжевый': 
          cl = 'orange';
          break;
        case 'желтый': 
          cl = 'yellow';
          break;
        case 'зеленый':
         cl = 'green';
          break;
        case 'голубой':
          cl = 'aqua';
          break;
        case 'синий':
          cl = 'blue';
          break;
        case 'фиолетовый':
          cl = 'violet';
          break;
        case 'розово-красный':
          cl = 'carmazin';
          break;
        case 'светло-коричневый':
          cl = 'lightbrown';
          break;
        }
        newLi.className = `fruit__item fruit_${cl}`;
      }   
      fruitsList.appendChild(newLi);
    }   
};

display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  
  let result = [];
  let n = 0;
  let resultControl = fruits;

  while (fruits.length > 0) {
    let elemNum = getRandomInt(0, fruits.length-1);
    result.push(fruits[elemNum]);
     fruits.splice(elemNum, 1);
    n++;
  }
  let check = 0;

  for(let i = 0; i <= result.length; i++){
    if (result[i] == resultControl[i]){
      check++;
    }
  }
  if(check == result.length){
    Swal.fire({
      icon: 'error',
      title: 'Ой...',
      text: 'Порядок не изменился!',
    })
  }
  examination(result);
  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  fruits = fruits.filter((item) => {
    const minWeight = document.querySelector('.minweight__input').value;
    const maxWeight = document.querySelector('.maxweight__input').value;

    let fruitsWeight = [];
    fruits.forEach(e => fruitsWeight.push(e.weight));
  
    if (isNaN(minWeight)|| minWeight == "" || isNaN(maxWeight) || maxWeight == ""){
      return Swal.fire('Заполните все поля!');
    } else if(maxWeight < minWeight){
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Вы задали неверный диапазон веса для сортировки'})
    }else if(minWeight < Math.min(...fruitsWeight)){
      return Swal.fire('Вес не может быть меньше самого маленького фрукта');
    } else if(maxWeight > Math.max(...fruitsWeight)){
      return Swal.fire('Вес не должен быть больше, чем у самого большого фрукта');
    }else{
    const i = item.weight;
    return (i <= maxWeight) && (i >= minWeight);}
  });
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const colorArray = ['розово-красный','красный','светло-коричневый','оранжевый','желтый','зеленый','голубой','синий','фиолетовый'];

 // функция сравнения двух элементов по цвету
const comparationColor = (a, b) => {
  firstColor = colorArray.indexOf(a.color);
  secondColor  = colorArray.indexOf(b.color);
  return secondColor < firstColor;
};


function quickSort(arr, comparation){
  if (arr.length < 2){
      return arr;
  }
  let index = Math.floor(Math.random() * arr.length);
  let currentItem = arr[index]; 
  let more = [];
  let less = [];

  for (let i = 0; i < arr.length; i++){
      if(i === index){
          continue;
      }
      if (comparation(currentItem,arr[i])){
          less.push(arr[i])
      }
      else{
          more.push(arr[i])
      }
  }
  arr = [...quickSort(less, comparation), currentItem,...quickSort(more, comparation)] 
  return arr;
};

const sortAPI = {
  // функция сортировки пузырьком
  bubbleSort(arr, comparation) {
    const n = arr.length;
    for (let i = 0; i < n-1; i++) {
      for (let j = 0; j < n-1-i; j++) {
        if (comparation(arr[j], arr[j+1])) {
          let temp = arr[j]
          arr[j] = arr[j+1]
          arr[j+1] = temp
        }
      }
    }       
  },
  
  // функция  быстрой сортировки
  quickSort(arr, comparation){
    fruits = quickSort(arr, comparation);
  },
  

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

//переключить значение sortKind между 'bubbleSort' / 'quickSort'
sortChangeButton.addEventListener('click', () => {
  if (sortKind == 'quickSort'){
    sortKind = 'bubbleSort';
    sortKindLabel.textContent = sortKind;
  }else if (sortKind == 'bubbleSort'){
    sortKind = 'quickSort';
    sortKindLabel.textContent = sortKind;
  }
});

sortActionButton.addEventListener('click', () => {
  sortKind = sortKindLabel.textContent;
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/
addActionButton.addEventListener('click', () => {
  let newFruit = {
    "kind" : "",
    "color": "",
    "weight": ""
  };
  newFruit.weight = +weightInput.value;
  newFruit.color = colorInput.value;
  newFruit.kind = kindInput.value;
  
  if(newFruit.weight == "" || newFruit.color == "" || newFruit.kind == ""){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Вы забыли заполнить какое-то поле при добавлении!',
      footer: 'При добавлении фрукта нужно заполнять все поля!'
    })
  } else if(!(colorArray.includes(newFruit.color))){
    Swal.fire('Ваш цвет не соответствует цвету фруктов. Выберите подходящий цвет из предложенных:\n *розово-красный \n *красный\n *светло-коричневый\n *оранжевый\n *желтый\n *зеленый\n *голубой\n *синий\n *фиолетовый')
} else if(isNaN(parseInt(newFruit.weight))){
  Swal.fire('Вес должен быть числом!')
}else{   
    fruits.push(newFruit);
    display();}
});

/*Проверка перемешивания*/
function examination(fruits){
  for(let i = 0; i < fruits.length; i++){
    if(fruits[i] == undefined){
      alert('Undefined value!');
    }else{
      for (let j = 0; j < fruits[i].length; j++){
        if (fruits[i][j] == undefined){
          alert('Undefined value!');
        }
      }
    }
  }
}
