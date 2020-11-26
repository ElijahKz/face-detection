

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    // Return true if you want to remove this cache,
                    // but remember that caches are shared across
                    // the whole origin
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// Inicializando variables
const btnAnalizar = document.getElementById("btnAnalizar");
const btnBorrar = document.getElementById("btnBorrar");
const resultado = document.getElementById("mi-x-result");



/** Permite obtener una lista (ul) clave:valor */
function getProperties(objeto) {
    var html = "<ul>";
    for (var property in objeto) {
        html += "<li>" + `${property}: ${objeto[property]}` + "</li>";
        //  console.log(`${property}: ${objeto[property]}`);
    }
    html += "</ul>";
    return html;
}
/** Inserta los datos del POST request en la vista */
function dynamicTable(response) {
    var table = document.getElementById("mi-x-result");
    var row = table.insertRow(1);
    var indice = row.insertCell(0);
    var genero = row.insertCell(1);
    var edad = row.insertCell(2);
    var gafas = row.insertCell(3);
    var emocion = row.insertCell(4);
    var ruido = row.insertCell(5);
    var mask = row.insertCell(6);
    var colorHair = row.insertCell(7);
    /**--------------------------------------------------------------- */
    
   
    var contador = response.length
    console.log(response)
    response.forEach(element => {
        try {           
            
            var rectDetec = document.createElement("DIV");
            rectDetec.setAttribute("id", "mi-x-rec" + contador);
            document.getElementById("mi-x-test").appendChild(rectDetec);
            var detecElemn = document.getElementById("mi-x-rec" + contador);
            detecElemn.style.position = "absolute";
            detecElemn.style.zIndex = "1";
            detecElemn.style.border = '2px solid red';
            detecElemn.style.top = element.faceRectangle.top + "px";
            detecElemn.style.left = element.faceRectangle.left + "px";
            detecElemn.style.width = element.faceRectangle.width + "px";
            detecElemn.style.height = element.faceRectangle.height + "px";

            var row = table.insertRow(1);
            var indice = row.insertCell(0);
            var genero = row.insertCell(1);
            var edad = row.insertCell(2);
            var gafas = row.insertCell(3);
            var emocion = row.insertCell(4);
            var mask = row.insertCell(5);
            var colorHair = row.insertCell(6);


            indice.innerHTML = contador;
            genero.innerHTML = element.faceAttributes.gender;
            edad.innerHTML = element.faceAttributes.age;
            gafas.innerHTML = element.faceAttributes.glasses;
            emocion.innerHTML = getProperties(element.faceAttributes.emotion);

            mask.innerHTML = getProperties(element.faceAttributes.makeup);
            colorHair.innerHTML = element.faceAttributes.hair.hairColor[0].color;

           
            contador = contador - 1;
        } catch (error) {
            console.log(error)
        }
    });


}
/*Request builder */
function requestBuilder(url) {
    /**----------------------------------------preparando la petición------------------------------------------- */
    var subscriptionKey = "<API-KEY>";
    var uriBase = "https://<INSTANCE-NAME>.cognitiveservices.azure.com/face/v1.0/detect";
    // Request parameters.
    var params = {
        "detectionModel": "detection_01",
        "recognitionModel": "recognition_03",
        "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
        "returnFaceId": "true"
    };
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + url + '"}',
    })

        .done(function (data) {
            // Show formatted JSON on webpage.
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
            //console.log(JSON.stringify(data, null, 2))
            dynamicTable(data)
        })

        .fail(function (jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ?
                "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ?
                "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                    jQuery.parseJSON(jqXHR.responseText).message :
                    jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });

}

/* Permite borrar */
function deleteImage() {

   
   window.location.assign( window.location.pathname)
  
}
/* Permite agregar */
function readImage() {
    var url = document.getElementById("inputImage").value;
    var img = document.getElementById("mi-x-url-imagen");
    img.src = url;
    /*-----------------------canvas--------------------------*/
    img.onload = function () {      

        document.getElementById("mi-x-test").style.width = img.width + "px";
        document.getElementById("mi-x-test").style.height = img.height + "px";
        requestBuilder(url);
    }


}



//window.addEventListener("resize", readImage);
btnAnalizar.addEventListener('click', readImage);
btnBorrar.addEventListener('click', deleteImage);


