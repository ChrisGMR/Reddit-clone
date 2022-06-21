
let username = browser.cookies.get()

let counter = 0;
function increaseLikes(event){
    fetch(`/upvote/${event.value}`, {method: "PUT"})
}
function decreaseLikes(event){
    fetch(`/downvotes/${event.value}`, {method: "PUT"})
}


