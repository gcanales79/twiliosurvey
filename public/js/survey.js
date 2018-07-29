$("#Submit").on("click", function (event) {
    event.preventDefault();
    var newCliente = {
        cliente: $("#cliente").val().trim(),
        local: $("#local").val().trim(),
        fecha_visita: $("#fecha_visita").val().trim(),
        celular: "+521" + $("#celular").val().trim(),
    }

    $.post("/api/clients", newCliente)
        .then(newCliente)

    $.post("/call",newCliente)
    .then(newCliente)
})