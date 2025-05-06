import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

export default function Home() {
  const [currencyData, setCurrencyData] = useState([]);
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [emi, setEmi] = useState(null);
  const [showTable, setShowTable] = useState(true);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(
          "https://v6.exchangerate-api.com/v6/b8a62933e757324b92ffe1bd/latest/USD"
        );
        const rates = response.data.conversion_rates;
        const formatted = Object.entries(rates).map(([code, rate]) => ({
          code,
          rate,
        }));
        setCurrencyData(formatted || []);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };
    fetchExchangeRate();
  }, []);

  const handleCalculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const years = parseInt(loanTerm);
    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    setEmi(emi.toFixed(2));
    setShowTable(true); // show table when EMI is calculated
  };

  const handleResetTable = () => {
    setShowTable(false);
    setEmi(null);
    setLoanAmount("");
    setInterestRate("");
    setLoanTerm("");
  };

  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "code", label: "ISO\u00a0Code", minWidth: 100 },
    {
      id: "population",
      label: "Population",
      minWidth: 170,
      align: "right",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "size",
      label: "Size\u00a0(km\u00b2)",
      minWidth: 170,
      align: "right",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "density",
      label: "Density",
      minWidth: 170,
      align: "right",
      format: (value) => value.toFixed(2),
    },
  ];

  const rows = [
    {
      name: "India",
      code: "IN",
      population: 1393409038,
      size: 3287263,
      density: 424.0,
    },
    {
      name: "China",
      code: "CN",
      population: 1444216107,
      size: 9596961,
      density: 150.5,
    },
    {
      name: "United States",
      code: "US",
      population: 331893745,
      size: 9833517,
      density: 33.7,
    },
    {
      name: "Brazil",
      code: "BR",
      population: 213993437,
      size: 8515767,
      density: 25.1,
    },
    {
      name: "Russia",
      code: "RU",
      population: 145912025,
      size: 17098242,
      density: 8.5,
    },
  ];

  return (
    <>
      <style>
        {`
          input[type=number]::-webkit-inner-spin-button,
          input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type=number] {
            -moz-appearance: textfield;
          }
        `}
      </style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          padding: "10px",
          boxSizing: "border-box",
          justifyContent: "flex-start",
        }}
      >
        <div style={{ padding: "10px" }}>
          <p style={{ fontSize: "2rem" }}>Loan Calculator Dashboard</p>
        </div>

        {/* Input Section */}
        <div style={{ width: "60%", padding: "10px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <TextField
              label="Loan Amount"
              variant="outlined"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
            />
            <TextField
              label="Interest Rate (%)"
              variant="outlined"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
            <TextField
              label="Loan Term (Years)"
              variant="outlined"
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ padding: "10px" }}>
          <Button variant="contained" onClick={handleCalculateEMI}>
            Calculator
          </Button>
        </div>

        {/* EMI Output */}
        {emi && (
          <div style={{ padding: "10px" }}>
            <p style={{ fontSize: "1rem", fontWeight: "800" }}>
              Monthly EMI: <span style={{ fontWeight: "500" }}>${emi}</span>
            </p>
          </div>
        )}

        {/* Dropdown and Reset */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            padding: "10px",
          }}
        >
          <FormControl sx={{ width: "200px" }}>
            <InputLabel id="demo-simple-select-label">Currency</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Currency"
            >
              {currencyData.map((currency) => (
                <MenuItem key={currency.code} value={currency.code}>
                  {currency.code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            style={{ borderColor: "purple", color: "purple" }}
            onClick={handleResetTable}
          >
            Reset Table
          </Button>
        </div>

        {/* Table */}
        {showTable && (
          <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <p style={{ fontSize: "1rem", padding: "10px", fontWeight: "900" }}>
                Amortization Schedule (USD)
              </p>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
        )}
      </div>
    </>
  );
}
