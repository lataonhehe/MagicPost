import { useEffect, useLayoutEffect, useState } from "react";

function GetData({
  provinceid,
  districtid,
  toDistrictID,
  wardid,
  serviceid,
  weightt,
}) {
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [service, setService] = useState([]);

  async function fetchDataProvince() {
    const url =
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/province";
    const token = "ecd6ab5f-a269-11ee-af43-6ead57e9219a";

    try {
      const response = await fetch(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/province`,
        {
          method: "GET",
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      //ProvinceID ProvinceName
      setProvince((await response.json()).data);
      // Xử lý dữ liệu ở đây
    } catch (error) {
      console.log("Error to get Province");
    }
  }
  async function fetchDataDistrict() {
    const url =
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/district";
    const token = "ecd6ab5f-a269-11ee-af43-6ead57e9219a";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          province_id: provinceid,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setDistrict(data);
          // Xử lý dữ liệu ở đây
        });

      // Xử lý dữ liệu ở đây
    } catch (error) {
      console.log("Error to get District");
    }
  }
  async function fetchDataWard() {
    const url =
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward";
    const token = "ecd6ab5f-a269-11ee-af43-6ead57e9219a";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          district_id: districtid,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setWard(data);

      // Xử lý dữ liệu ở đây
    } catch (error) {
      console.log("Error to get District");
    }
  }
  async function fetchDataService() {
    const url =
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services";
    const token = "ecd6ab5f-a269-11ee-af43-6ead57e9219a";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shop_id: 4791893,
          from_district: districtid,
          to_district: toDistrictID,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setService(data);

      // Xử lý dữ liệu ở đây
    } catch (error) {
      console.log("Error to get District");
    }
  }
  async function canculatePayment() {
    const url =
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";
    const token = "ecd6ab5f-a269-11ee-af43-6ead57e9219a";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "test",
          service_id: serviceid,
          coupon: null,
          from_district_id: districtid,
          to_district_id: toDistrictID,
          to_ward_code: wardid,
          weight: weightt,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setService(data);

      // Xử lý dữ liệu ở đây
    } catch (error) {
      console.log("Error to get District");
    }
  }

  useLayoutEffect(() => {
    fetchDataProvince();
    fetchDataDistrict();
    fetchDataWard();
    fetchDataService();
    canculatePayment();
    // console.log(ward);
  }, []);

  return <h1>Data</h1>;
}

export default GetData;
