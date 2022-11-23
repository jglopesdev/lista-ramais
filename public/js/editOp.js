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
