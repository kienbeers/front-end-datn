import { async } from "@firebase/util";
import { useState } from "react";
import QRCode from "qrcode";
function CreateQR() {
  const [qrValue, setQrValue] = useState("");
  const [qrImageUrl, setQRImageUrl] = useState("");

  const handleSubmit = async (e) => {
    console.log("vào handle submit");
    if (!qrValue) {
      return <h1 className="text-danger">chào</h1>;
    }
    // {qrValue ? (<h1 className="text-danger">có</h1>) : (<h1 className="text-danger">không</h1>)}
    e.preventDefault();
    if (!qrValue) {
      console.log("not null");
      return alert("vào rồi");
    }

    const a = {
      fullName: "a",
      phone: "b",
    };
    const b =
      `\nMÃ HOÁ ĐƠN: c` +
      `\nNGÀY MUA HÀNG:b` +
      `\nTÊN KHÁCH HÀNG: a` 
      

    const response = await QRCode.toDataURL(b);
    console.log(response);
    setQRImageUrl(response);
  };

  return (
    <div className="col-md-6">
      <h2>create qr</h2>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <label htmlFor="text"> text</label>
            <input
              type="text"
              value={qrValue}
              onChange={(e) => setQrValue(e.target.value)}
              className="form-control"
              id="text"
            />
            <button type="submit" className="btn btn-primary">
              Tạo
            </button>
          </form>
          {qrImageUrl && (
            <div className="mt-4">
              <a href={qrImageUrl} download="qr.png">
                <img src={qrImageUrl} alt="QR CODE" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateQR;
