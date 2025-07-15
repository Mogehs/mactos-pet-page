import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const QrCode = () => {
  const { id } = useParams();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getQrCodeInfo = async () => {
      setLoading(true);
      const response = await axios.get(
        `https://mascotas-backend.onrender.com/api/qrcode/${id}`
      );
      setData(response.data);
      console.log(response.data);
      setLoading(false);
    };
    getQrCodeInfo();
  }, [id]);
  return (
    <div>
      {!loading ? (
        <>
          <p>{data?.message}</p>
          <h1>{data?.data?.message}</h1>
        </>
      ) : (
        "Loading....."
      )}
    </div>
  );
};

export default QrCode;
