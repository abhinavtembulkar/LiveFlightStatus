const eles = document.getElementById('data')

const credentials = {
    "Authorisation" : "Bearer bpapqkvj6csttescwg8wnk9v",
    "Accept" : "application/json",
    "Access-Control-Allow-Origin":"*"
}

const fetcher = () => {
    const xhttp = new XMLHttpRequest()
    xhttp.onload = () =>{
        let text = JSON.parse(xhttp.responseText)
        eles.innerText = text['pagination']
        console.log(text['pagination'])
    }
    
    xhttp.open("POST","https://api.lufthansa.com/v1/flight-schedules",true)
    xhttp.setRequestHeader("Access-Control-Allow-Origin","https://api.lufthansa.com/v1/flight-schedules","https://abhinavtembulkar.github.io/chec/")
    xhttp.setRequestHeader("Access-Control-Allow-Methods","POST","GET")
    for (let key in credentials) {
        console.log(key,credentials[key])
        xhttp.setRequestHeader(key,credentials[key])        
    }
    xhttp.send()
}

setInterval(fetcher,4000)