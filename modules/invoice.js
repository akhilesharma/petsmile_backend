
function sellerInvoice() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Invoice</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    </head>
    <style>
      .container-fluid{
        padding: 0px 40px!important;
      }    
        p{
            margin-bottom: 5px;
        }
        .date{
            font-size: 12px;
            float: right;
        }
        .invoice-text{
            padding-left: 75px;
        }
        .top-left-details p , .top-right-details p{
            font-size: 13px;
        } 
        .top-left-details ,  .top-right-details{
            max-width: 400px;
            width: 267px;
        }
        .borderLine {
        width: 1px;
        height: auto;
        background: #c8c9ca;
        margin: 23px 0px;
    }
    table tr td:nth-child(1) {
        text-align: left;
        border-left: none;
    }
    table tr td:last-child {
        border-right: none;
    }
    .table tr:first-child {
      border-top: 0;
    }
    .table tr:last-child {
      border-bottom: 0;
    }
    
    .table{
        font-size: 13px;
    }
    
    .total-row{
        border-bottom: 1px solid black;
    }
    
    .total-row td{
        border:none;
        padding: 12px 0px;
    }
    @media (max-width:425px) {
      .top-details{
        display: block!important;
      }
    
      .borderLine{
        display: none!important;
      }
    
      .authorized{
        display: block!important;
        text-align: left!important;
      }
    }
    </style>
    <body>
    <div class="container-fluid mt-2">
      <div class="row">
        <div class="col-12">
            <div class="title text-center">
                 <h3 ><span class="invoice-text">Invoice</span> <span class="date">June 22, 2022</span></h3>
             </div>
        </div>  
      </div>
      <div class="row mt-3">
        <div class="col-12  mt-3">
            <div class="top-details d-flex justify-content-between " >
                <div class="top-left-details py-2 ">
                    <p><span>Store Name :</span>  <span> Pets's World Store</span>  </p>
                    <p><span>Address :</span>  <span> 9HW5+JMP,Chontabamba, Iquitos 19210, Peru</span>  </p>
                </div>
                <div class="top-right-details py-2">
                    <p><strong><span>Order ID :</span>  <span> #HD8474j</span> </strong> </p>
                    <p><span>Order Date & Time :</span>  <span> June 22,2022,3:38 pm</span>  </p>
                    <p><span>Payment Method:</span>  <span> Cash</span>  </p>
                </div>
             </div>
        </div>
        <hr>
      </div>
      <div class="row ">
        <div class="col-12  ">
            <div class="top-details d-flex justify-content-between " >
             
                <div class="top-left-details py-2 ">
                    <p><strong>User Details</strong></p>
                    <p><span>User Name :</span>  <span> Rahul Sharma</span>  </p>
                    <p><span>Contact Number :</span>  <span> +644-889-2430</span>  </p>
                    <p><span>Email :</span>  <span> sharmarahul484@gmail.com</span>  </p>
                </div>
                <div class="borderLine d-block py-2">
                </div>
                <div class="top-right-details py-2">
                    <p><strong>Shipping Address</strong></p>
                    <p><span>C 142, Sector 63 RD, C Block, Sector 63, Noida, Uttar Pradesh, 201301</span> </p>
                </div>
             </div>
        </div>
        <hr>
      </div>
      <div class="row">
        <div class="col-12">
            <div class="summary-heading">
                <p><strong>Order Summary</strong></p>
            </div>
            <table class="table table-bordered table-sm text-center">
                <tbody>
                  <tr>
                    <td>Description of Goods </td>
                    <td>Qty</td>
                    <td>Price</td>
                    <td>Tax($)</td>
                    <td>Total</td>
                  </tr>
                  <tr>
                    <td>iphone 12 max pro</td>
                    <td>1</td>
                    <td>$ 330</td>
                    <td>$ 330</td>
                    <td>$ 330</td>
                  </tr>
                  <tr>
                    <td>iphone 12 max pro</td>
                    <td>1</td>
                    <td>$ 330</td>
                    <td>$ 330</td>
                    <td>$ 330</td>
                  </tr>
                  <tr class="total-row" >
                    <td colspan="2"><Strong>Total</Strong></td>
                    <td> <strong> $ 330</strong></td>
                    <td> <strong> $ 330</strong></td>
                    <td> <strong> $ 330</strong></td>
                  </tr>
                  <tr>
                    <td style="border:none" colspan="3"><Strong></Strong></td>
                    <td style="border:none"> <strong> Grand Total</strong></td>
                    <td style="border:none"> <strong> $ 686.00</strong></td>
                  </tr>
                </tbody>
              </table>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-12  ">
            <div class="top-details d-flex justify-content-between " >
             
                <div class="top-left-details py-2 ">
                    <img src="img/pet_world_logo.svg" alt="" width="100">
                    <p class="text-uppercase mt-3">certified that the particulars given above are true and correct terms & conditions/remarks(if any) This is a computer generated invoice  </p>
                </div>
                <div class="top-right-details text-end authorized d-flex justify-content-end align-items-end py-2">
                    <p>Authourized Signatory </p>
                </div>
             </div>
        </div>
      </div>
    </div>
    </body>
    </html>


    `
}