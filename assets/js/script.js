var myHeaders = new Headers();
myHeaders.append("apikey", "");  ///API KEY 9H8RMV7dsMSjbMDZfVRy5PMBK2KY01MR

var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};

let taskStorage = JSON.parse(
    window.localStorage.getItem("taskStorage") || "[]"
);

const botonConvertir = document.querySelector("#convertir");

const botonInvertir = document.querySelector("#invertir");

document.getElementsByTagName('select')[0].onchange = function() {
    var index = this.selectedIndex;
    var inputText = this.children[index].value;
    console.log(inputText);
}

document.getElementsByTagName('select')[1].onchange = function() {
    var index = this.selectedIndex;
    var inputText = this.children[index].value;
    console.log(inputText);
}

botonConvertir.addEventListener("click", async (e) => {
    e.preventDefault();
    const valor = document.getElementById("texto-valor").value;
    const primero = document.getElementsByTagName('select')[0].selectedIndex;
    const segundo = document.getElementsByTagName('select')[1].selectedIndex;
  
    if (!valor) return alert("No hay nada en el campo de valor a convertir");
  
    const resultado = await convertirValor(valor, primero, segundo)

    document.getElementById("section").children[1].appendChild(resultado);
});

botonInvertir.addEventListener("click", (e) => {
    const primero = document.getElementsByTagName('select')[0].selectedIndex;
    const segundo = document.getElementsByTagName('select')[1].selectedIndex;

    document.getElementsByTagName('select')[0].selectedIndex = segundo
    document.getElementsByTagName('select')[1].selectedIndex = primero
})

const convertirValor = async (valor, primero, segundo) => {
    const fragment = document.createDocumentFragment();
    const valorPrimero = document.getElementsByTagName('select')[0].children[primero].value.toString()
    const valorSegundo = document.getElementsByTagName('select')[1].children[segundo].value.toString()
    
    let resultado
    const address = 'https://api.apilayer.com/fixer/convert?to='+valorSegundo+'&from='+valorPrimero+'&amount='+valor
    const res = await fetch(address, requestOptions)
    const jsonData = await res.json()
    try {
        resultado = jsonData.result
    } catch (error) {
        console.log('error', error)
    }  

    

    const divResultado = createDiv({
        classDiv: ["flex","justify-center", "flex-col", "text-left", "mt-3", "text-violet-500"],
        children: [
            createP({
                text: valor+' '+valorPrimero+" ="
            }),
            createP({
                text: resultado+' '+valorSegundo
            })
        ],
    });

    const newTask = createTableRowHistorial({valor, valorPrimero, resultado, valorSegundo});

    if(document.getElementById('tablas').children[1].children[0].children[1].children.length < 5){
        document.getElementById('tablas').children[1].children[0].children[1].appendChild(newTask);
    } else {
        document.getElementById('tablas').children[1].children[0].children[1].children[0].remove()
        document.getElementById('tablas').children[1].children[0].children[1].appendChild(newTask);
        taskStorage.shift()
    }
    
    const task = {valor, valorPrimero, resultado, valorSegundo};
    
    taskStorage.push({ ...task });
    window.localStorage.setItem("taskStorage", JSON.stringify(taskStorage));
    
    document.getElementById("section").children[1].children[2].remove()
    fragment.appendChild(divResultado);
    return fragment;
};

const agregarOptions = async () => {
    const primero = document.getElementsByTagName('select')[0]
    const segundo = document.getElementsByTagName('select')[1]

    const res = await fetch("https://api.apilayer.com/fixer/symbols", requestOptions)
    const jsonData = await res.json()
    const monedas = Object.keys(jsonData.symbols)
    try {
        monedas.forEach(moneda => {
            primero.appendChild(createOption(moneda))
            segundo.appendChild(createOption(moneda))
        });
    } catch (error) {
        console.log('error', error)
    }
}

const createOption = (valor) => {
    var option = document.createElement("option");
    
    option.value = valor
    option.text = valor

    return option;
}

const createTableRow = (valor, divisa, valorFin, divisaFin) => {
    var tr = document.createElement("tr");
    const lista = ["bg-violet-700" ,"border-violet-900" ,"border-t"]
    tr.classList.add(...lista)

    const fecha = new Date()

    console.log(valor)
    console.log(divisa)
    console.log(valorFin)
    console.log(divisaFin)

    t1 = createTableH(valor)
    tr.appendChild(t1)
    t2 = createTableH(divisa)
    tr.appendChild(t2)
    t3 = createTableH(valorFin.toString())
    tr.appendChild(t3)
    t4 = createTableH(divisaFin)
    tr.appendChild(t4)
    t5 = createTableH(fecha.toJSON().slice(0, 10))
    tr.appendChild(t5)

    return tr;
}

const createTableRowHistorial = (valor) => {
    var tr = document.createElement("tr");
    const lista = ["bg-violet-700" ,"border-violet-900" ,"border-t"]
    tr.classList.add(...lista)

    const fecha = new Date()

    t1 = createTableH(valor.valor)
    tr.appendChild(t1)
    t2 = createTableH(valor.valorPrimero+' =')
    tr.appendChild(t2)
    t3 = createTableH(valor.resultado)
    tr.appendChild(t3)
    t4 = createTableH(valor.valorSegundo)
    tr.appendChild(t4)
    t5 = createTableH(fecha.toJSON().slice(0, 10))
    tr.appendChild(t5)

    return tr;
}

const createCoefRow = (valor, divisa, valorFin, divisaFin) => {
    var tr = document.createElement("tr");
    const lista = ["flex" , "w-full",  "bg-violet-700",  "border-violet-900",  "border-t"]
    tr.classList.add(...lista)

    classt1 = ["w-4/12", "pl-6", "py-3", "text-white"]
    classt2 = ["w-2/12", "py-3", "text-violet-400"]
    classt3 = ["w-3/12", "py-3", "text-violet-400"]
    classt4 = ["w-3/12", "py-3", "text-violet-400"]

    t1 = createTableHCoef(valor, classt1)
    tr.appendChild(t1)
    t2 = createTableHCoef(divisa, classt2)
    tr.appendChild(t2)
    t3 = createTableHCoef(valorFin, classt3)
    tr.appendChild(t3)
    t4 = createTableHCoef(divisaFin, classt4)
    tr.appendChild(t4)

    return tr;
}

const generarTablaCoef = async () => {
    const tablaCoef = document.getElementById('tablaCoef')
    const res = await fetch("https://api.apilayer.com/fixer/symbols", requestOptions)
    const symbolData = await res.json()

    const monedas = Object.keys(symbolData.symbols)

    const nombres = Object.values(symbolData.symbols)

    const resDos = await fetch('https://api.apilayer.com/fixer/latest?symbols=&base=USD', requestOptions)
    const conversionData = await resDos.json()

    const coeficientes = Object.values(conversionData.rates)

    const hora = new Date()

    const horaString = hora.getHours()+':'+hora.getMinutes()+':'+hora.getSeconds()

    for (let i = 0; i < 170; i++) {
        let newRow = createCoefRow(nombres[i], monedas[i], coeficientes[i], horaString)
        tablaCoef.appendChild(newRow)
    }
}

const createTableH = (texto) => {
    var th = document.createElement("th");
    const lista = ["px-6", "py-3", "text-violet-400"]

    th.scope = "col"
    th.classList.add(...lista)

    text = document.createTextNode(texto)
    th.appendChild(text);

    return th;
}

const createTableHCoef = (texto, classList) => {
    var th = document.createElement("th");
    th.scope = "col"
    th.classList.add(...classList)
    text = document.createTextNode(texto)
    th.appendChild(text);

    return th;
}

const createDiv = ({ classDiv, children }) => {
    const div = document.createElement("div");
    div.classList.add(...classDiv);
  
    children.forEach((child) => {
      div.appendChild(child);
    });
  
    return div;
};

const createP = ({ text, child }) => {
    const parrafo = document.createElement("p");
  
    if (child) {
      parrafo.appendChild(child);
    }
  
    if (text) {
      text = document.createTextNode(text);
      parrafo.appendChild(text);
    }
  
    return parrafo;
};

taskStorage.forEach(task => {
    valor = task.valor
    valorPrimero = task.valorPrimero
    resultado = task.resultado
    valorSegundo = task.valorSegundo
    const newTask = createTableRowHistorial({valor, valorPrimero, resultado, valorSegundo});

    if(document.getElementById('tablas').children[1].children[0].children[1].children.length < 5){
        document.getElementById('tablas').children[1].children[0].children[1].appendChild(newTask);
    }
});

  agregarOptions()
  generarTablaCoef()