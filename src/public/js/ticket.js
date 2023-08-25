document.getElementById('impimirTicket').addEventListener('click',()=>{
    document.getElementById('impimirTicket').classList.toggle('hide');
    window.print();
    document.getElementById('impimirTicket').classList.toggle('show');
})