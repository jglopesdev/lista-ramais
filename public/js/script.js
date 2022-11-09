const { response } = require("express");

let accordions = document.querySelectorAll(".accordion-item");
accordions = [].slice.call(accordions, 0);

accordions.reverse().forEach((accordion, index) => {
  accordion.style.zIndex = "" + (100 + index);
  accordion.style.zIndex += " !important";
});

// ----- Confirm delete ----- //
let idUser = window.location.href;
idUser = idUser.split("/edit/");
idUser = idUser[1];
console.log(idUser);
const deleteUser = (event) => {
  event.preventDefault();
  let okConfirm = confirm("Confirma a exclusão do usuário?");

  console.log(okConfirm);
  if (okConfirm == true) {
    fetch(`/access-panel/delete/${idUser}`, {
      method: "GET",
    }).then(() => {
      alert("Usuário(a) excluído(a) com sucesso!");
      window.location.replace("http://localhost:3000/access-panel/");
    });
  }
};

const btnDel = document.querySelector("#btnDel");
btnDel.addEventListener("click", deleteUser);

//--------------------------------------------------------------------//

fetch("http://localhost:3000/listaRamais")
  .then((response) => response.json())
  .then((listaRamais) => {
    let companies = listaRamais.map(item =>{
    let comeriMatriz = new Array(item.company["Comeri Matriz"])
    })
     console.log(comeriMatriz)
  }
    // const vendas = document.querySelector("#vendas");
    // if (vendas.classList.contains("active show")) {
    //   listaRamais.forEach((item) => {
    //     const createTab = document.createElement("table");
    //     createTab.classList.add("table table-sm");
    //     createTab.setAttibute("id", "tabela");
    //     createTab.innerHTML = `
    //           <thead>
    //             <tr>
    //               <th class="col-1" id="ramal">Ramal</th>
    //               <th class="col-11" id="depto">${item.department}</th>
    //             </tr>
    //           </thead>
    //           <tbody id="tbody">
    //             <tr>
    //               <td><a href="tel:${item.ramal}">${item.ramal}</a></td>
    //               <td>${item.name}</td>
    //             </tr>
    //           </tbody>
    //         `;
    //     createTab.appendChild(vendas);
    //   });
    // }
  });
