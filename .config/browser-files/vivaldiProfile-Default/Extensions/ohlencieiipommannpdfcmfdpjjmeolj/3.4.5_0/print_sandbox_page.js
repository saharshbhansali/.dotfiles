function printContent(payload) {
  document.body.innerHTML = payload.body;
  setTimeout(function() {
    window.focus();
    window.print();
  }, 250);
}


window.addEventListener(
  "message",
  (event) => {
    if(event.isTrusted) {
      switch(event.data.type) {
        case "PfPrintContent":
          printContent(event.data.payload);
          break;
      }
    }
  },
  false
);
