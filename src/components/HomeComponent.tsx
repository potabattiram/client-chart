import React, { useState, useEffect } from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import axios from "axios"; // Import Axios for API requests

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: "xy"as const,
      },
      pan: {
        enabled: true,
        mode: "xy" as const,
      },
    },
  },
};


export default function HomeComponent() {
    const [data, setData] = useState<any[]>([])

    const [xAxisData, setXAxisData] = useState(0);
    const [yAxisData, setYAxisData] = useState(0);
  
    const [loading, setLoading] = React.useState(false);
  

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/get"); // Replace "YOUR_API_ENDPOINT" with your actual API endpoint
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  if (!data) {
    return <div>Loading...</div>;
  }

  const chartData = {
    labels: data.map((item: any) => item.xAxisData),
    datasets: [
      {
        label: "Dataset 1",
        data: data.map((item: any) => item.yAxisData),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };



 
  function handleClick(value:any) {
    setLoading(value);
  }


  
  function InsertData() {
    handleClick(true);
    axios
      .post("http://localhost:3001/insert", {
        xAxisData: xAxisData,
        yAxisData: yAxisData,
      })
      .then((res) => {
        console.log(res);
        handleClick(false);
        fetchData();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <>
      <div style={{display:'flex', flexDirection:'column', margin:'1rem', gap:'1rem'}}>
        <h2>GlobalCorp</h2>
        <TextField
          id="outlined-basic"
          label="Date"
          variant="outlined"
          placeholder="2023-07-06"
          onChange={(e: any) => setXAxisData(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="Revenue"
          variant="outlined"
          placeholder="100000"
          onChange={(e: any) => setYAxisData(e.target.value)}
        />

      

        <LoadingButton
          onClick={InsertData}
          endIcon={<SendIcon />}
          loading={loading}
          loadingPosition="end"
          variant="contained"
          style={{width:'6rem'}}>
          <span>Send</span>
        </LoadingButton>
      </div>

      <Line options={options} data={chartData} plugins={[zoomPlugin]} />
    </>
  );
}
