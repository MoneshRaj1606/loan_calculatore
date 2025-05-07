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
  const [showTable, setShowTable] = useState(false);
  const [amortizationData, setAmortizationData] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

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
    setShowTable(true);

    let balance = principal;
    const schedule = [];

    for (let month = 1; month <= months; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month,
        principal: principalPayment.toFixed(2),
        interest: interestPayment.toFixed(2),
        balance: balance > 0 ? balance.toFixed(2) : "0.00",
      });
    }

    setAmortizationData(schedule);
  };

  const handleResetTable = () => {
    setShowTable(false);
    setEmi(null);
    setLoanAmount("");
    setInterestRate("");
    setLoanTerm("");
    setAmortizationData([]);
  };

  const getConvertedEmi = () => {
    const selectedRate = currencyData.find((c) => c.code === selectedCurrency)?.rate || 1;
    return emi ? (emi * selectedRate).toFixed(2) : "0.00";
  };

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

      <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
        <div style={{ maxWidth: "1000px", width: "100%" }}>
          <div style={{ paddingBottom: "20px" }}>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1976d2" }}>
              Loan Calculator Dashboard
            </p>
          </div>

          {/* Input Section */}
          <div style={{ width: "100%", paddingBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
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

          <div style={{ paddingBottom: "20px" }}>
            <Button variant="contained" color="primary" onClick={handleCalculateEMI}>
              Calculate
            </Button>
          </div>

          {/* EMI Output */}
          {emi && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                flexWrap: "wrap",
                paddingBottom: "20px",
              }}
            >
              <p style={{ fontSize: "1rem", fontWeight: "800" }}>
                Monthly EMI: <span style={{ fontWeight: "500" }}>${emi}</span>
              </p>

              <FormControl sx={{ width: "140px" }}>
                <InputLabel>Currency</InputLabel>
                <Select
                  label="Currency"
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                >
                  {currencyData.map((currency) => (
                    <MenuItem key={currency.code} value={currency.code}>
                      {currency.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <p style={{ fontSize: "1rem", fontWeight: "800" }}>
                Converted EMI:{" "}
                <span style={{ fontWeight: "500" }}>
                  {getConvertedEmi()} {selectedCurrency}
                </span>
              </p>

              <Button
                variant="outlined"
                style={{ borderColor: "purple", color: "purple" }}
                onClick={handleResetTable}
              >
                Reset Table
              </Button>
            </div>
          )}

          {/* Amortization Table */}
          {showTable && (
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <p style={{ fontSize: "1rem", padding: "10px", fontWeight: "900" }}>
                Amortization Schedule (USD)
              </p>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="amortization table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      <TableCell>Principal</TableCell>
                      <TableCell>Interest</TableCell>
                      <TableCell>Remaining Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {amortizationData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>{row.principal} USD</TableCell>
                        <TableCell>{row.interest} USD</TableCell>
                        <TableCell>{row.balance} USD</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </div>
      </div>
    </>
  );
}