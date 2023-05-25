function Policy() {
  const url =
    "https://firebasestorage.googleapis.com/v0/b/fir-react-storage-96f9d.appspot.com/o/images%2F091d4f1bebc76ea61eec0b9d8af26e5f.jpg?alt=media&token=05f39496-dedf-4661-b8a9-e0ad07c6fc78";
  return (
    <div className="row ">
      <div className="col-12">
        <div
          style={{
            background: `no-repeat center url(${url})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            width: "80%",
            marginLeft: "10%",
            height: "710px",
            borderRadius: "10px",
          }}
        >
          <h6 className="pt-5 pb-5">
            <div className="row">
              <div className="col-4"></div>
              <div className="col-8 fw-bold px-5">
                <h3>CHÍNH SÁCH ĐỔI HÀNG</h3>
                <span className="pt-2 fs-6">
                  <h6 className="fw-bold text-danger">1. Sản phẩm không lỗi</h6>
                  <p className="fs-6" style={{ lineHeight: "2" }}>
                    - Khách hàng muốn đổi sang sản phẩm khác có giá tiền bằng
                    hoặc lớn hơn, Kinglap sẽ kiểm tra tình trạng máy và thông
                    báo đến Khách hàng để thực hiện đổi hàng.
                  </p>
                  <h6 className="fw-bold text-danger mt-2">
                    2. Sản phẩm lỗi do nhà sản xuất
                  </h6>
                  <p className="fs-6" style={{ lineHeight: "2" }}>
                    - Quý khách được quyền đổi máy mới nếu máy của Quý khách mắc
                    lỗi kỹ thuật trong vòng 10 ngày kể từ thời điểm mua máy mới
                    chính hãng. Lỗi kỹ thuật này được xác định do nhà sản xuất.
                    <br />
                    - Đổi sản phẩm giống hệt tại cửa hàng mua trước đó (Cùng
                    model, màu sắc, cấu hình), với điều kiện ngoại hình máy như
                    mới, không bị xước, không mất tem và kèm theo đầy đủ hộp,
                    các phụ kiện đi kèm.
                    <br />- Nếu không có sản phẩm giống hệt, quý khách đợi điều
                    chuyển hàng về tối đa 7 ngày. Sản phẩm được đổi sang là sản
                    phẩm mới 100%.
                  </p>
                  <h6 className="fw-bold text-danger mt-2">
                    3. Sản phẩm lỗi do người sử dụng
                  </h6>
                  <p>- Không áp dụng đổi trả với sản phẩm. </p>
                  <h6 className="fw-bold text-danger mt-2">4. Lưu ý</h6>
                  <p className="fs-6" style={{ lineHeight: "2" }}>
                    - Khi đổi sản phẩm khác, khách hàng phải có đầy đủ các sản
                    phẩm đi kèm trước đó, nếu không thì sẽ không được đổi hàng.
                    <br />
                    - Khi khách hàng đã thanh toán, trong trường hợp khách
                    hàng muốn huỷ hàng ở trạng thái chờ xác nhận, khách hàng sẽ
                    nhận lại 90% tổng tiền đã thanh toán.
                  </p>
                </span>
              </div>
            </div>
          </h6>
        </div>
      </div>
    </div>
  );
}

export default Policy;
