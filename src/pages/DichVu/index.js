import { blue } from "@mui/material/colors";
import dv1 from "~/assets/Dichvu1.png";
import dv2 from "~/assets/Dichvu2.png";
import dv3 from "~/assets/Dichvu3.png";
import dv4 from "~/assets/Dichvu4.png";
import dv5 from "~/assets/Dichvu5.png";
import dv6 from "~/assets/Dichvu6.png";

function DichVu() {
  return (
    <div style={{ lineHeight: "1rem" }}>
      <h2 style={{ margin: "60px", color: "#f38600" }}>
        Thông tin các gói dịch vụ
      </h2>
      <img src={dv1} alt="dichvu" style={{ width: "1250px" }} />
      <img src={dv2} alt="dichvu" style={{ width: "1250px" }} />
      <img src={dv3} alt="dichvu" style={{ width: "1250px" }} />
      <img src={dv4} alt="dichvu" style={{ width: "1250px" }} />
      <img src={dv5} alt="dichvu" style={{ width: "1250px" }} />
      <img src={dv6} alt="dichvu" style={{ width: "1250px" }} />

      <p
        style={{
          fontSize: "24px",
          lineHeight: "120px",
          color: "#ef6c00",
          fontWeight: "bold",
        }}
      >
        ♦ Ghi chú: - Bảng giá cước dịch vụ cộng thêm chưa bao gồm cước chính -
      </p>
      <p
        style={{
          fontSize: "24px",
          lineHeight: "60px",
          color: "#ef6c00",
          fontWeight: "bold",
        }}
      >
        Bảng giá chưa bao gồm thuế giá trị gia tăng
      </p>
    </div>
  );
}

export default DichVu;
