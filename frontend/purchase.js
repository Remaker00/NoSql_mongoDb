
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('rzp-button1').onclick = async function (e) {
        e.preventDefault();

        const token = localStorage.getItem('token');
        try {
            let response = await fetch('/payment', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }

            let orderData = await response.json();

            var options = {
                key: 'rzp_test_CVgkn5EB3ZFWXF',
                amount: "1500",
                currency: "INR",
                order_id: orderData.order.id,
                
                handler: async function (response) {
                    await fetch('/payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            orderId: orderData.order.id,
                        }),
                    })
                    .then(()=> {
                        alert("You are a premium Member Now");
                        document.getElementById('rzp-button1').style.display="none";
                        document.getElementById('premium').textContent="You Are A Premium User Now";


                    })
                    .catch(err => {
                        console.log("Error updating Status");
                    })
                }
            }
            var rzp1 = new Razorpay(options);

            rzp1.open();
        } catch (error) {
            console.error("Error processing payment:", error);
        }
    };
});
