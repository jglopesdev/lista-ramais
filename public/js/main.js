"use strict";
let accordions = document.querySelectorAll(".accordion-item");
accordions = [].slice.call(accordions, 0);

accordions.reverse().forEach((accordion, index) => {
  accordion.style.zIndex = "" + (100 + index);
  accordion.style.zIndex += " !important";
});


async function fetchRamais(url) {
  const ramaisResponse = await fetch(url);
  const comeriMatVendas = await ramaisResponse.json();
  console.log(comeriMatVendas)
  const createTag = (tagName) => {
    return document.createElement(tagName);
  };
  
  const createTab = (filteredArray, appendChild) => {
    //Cria a tabela
    let table = createTag("table");
    table.classList.add("table", "table-sm", "text-center");
    table.id = "tabela";
    document.querySelector(appendChild).appendChild(table);

    for ({ ramal, name, department } of filteredArray) {
      //Cria a estrutura do cabeçalho
      let thead = createTag("thead");
      thead.id = "thead";
      table.appendChild(thead);
      let trHead = createTag("tr");
      thead.appendChild(trHead);

      //Cria o conteudo do cabeçalho
      let th = createTag("th");
      th.classList.add("col-1");
      th.id = "ramal";
      th.textContent = "Ramal";
      trHead.appendChild(th);
      let th2 = createTag("th");
      th2.classList.add("col-11");
      th2.id = "depto";
      th2.textContent = department;
      trHead.appendChild(th2);

      //Cria a estrutura do corpo
      let tbody = createTag("tbody");
      tbody.id = "tbody";
      table.appendChild(tbody);
      let trBody = createTag("tr");
      tbody.appendChild(trBody);

      // //Cria o conteudo do corpo
      let td = createTag("td");
      trBody.appendChild(td);
      let a = createTag("a");
      a.setAttribute("href", ramal);
      a.textContent = ramal;
      td.appendChild(a);
      let td2 = createTag("td");
      td2.textContent = name;
      trBody.appendChild(td2);
    }
  };
  console.log(comeriMatVendas)
  createTab(comeriMatVendas, "#vendas");
  
} //endFetch
  fetchRamais("http://localhost:3000/listaRamais/comeri/matriz/vendas");
