const transactionForm = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const initialEl = document.getElementById("initial");
const incomeEl = document.getElementById("income");
const expensesEl = document.getElementById("expenses");
const finalEl = document.getElementById("final");
const initialInput = document.getElementById("initial-balance");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let initialBalance = parseFloat(localStorage.getItem("initialBalance")) || 0;

function renderTransactions() {
  transactionList.innerHTML = "";
    let totalIncome = 0;
      let totalExpenses = 0;

        transactions.forEach((t, index) => {
            if (t.type === "income") totalIncome += t.amount;
                else totalExpenses += t.amount;

                    const li = document.createElement("li");
                        li.classList.add(t.type === "expense" ? "expense" : "income");
                            li.innerHTML = `
                                  <span>${t.name} - $${t.amount.toFixed(2)} 
                                        <small>(${t.date}, ${t.category})</small></span>
                                              <button class="delete-btn" onclick="deleteTransaction(${index})">X</button>
                                                  `;
                                                      transactionList.appendChild(li);
                                                        });

                                                          initialEl.textContent = initialBalance.toFixed(2);
                                                            incomeEl.textContent = totalIncome.toFixed(2);
                                                              expensesEl.textContent = totalExpenses.toFixed(2);
                                                                finalEl.textContent = (initialBalance + totalIncome - totalExpenses).toFixed(2);

                                                                  localStorage.setItem("transactions", JSON.stringify(transactions));
                                                                    localStorage.setItem("initialBalance", initialBalance);
                                                                    }

                                                                    transactionForm.addEventListener("submit", function(e) {
                                                                      e.preventDefault();
                                                                        const type = document.getElementById("type").value;
                                                                          const name = document.getElementById("name").value;
                                                                            const amount = parseFloat(document.getElementById("amount").value);
                                                                              const date = document.getElementById("date").value;
                                                                                const category = document.getElementById("category").value;

                                                                                  if (name && amount && date && category) {
                                                                                      transactions.push({ type, name, amount, date, category });
                                                                                          renderTransactions();
                                                                                              transactionForm.reset();
                                                                                                }
                                                                                                });

                                                                                                function deleteTransaction(index) {
                                                                                                  transactions.splice(index, 1);
                                                                                                    renderTransactions();
                                                                                                    }

                                                                                                    function setInitialBalance() {
                                                                                                      const value = parseFloat(initialInput.value);
                                                                                                        if (!isNaN(value) && value >= 0) {
                                                                                                            initialBalance = value;
                                                                                                                renderTransactions();
                                                                                                                  }
                                                                                                                  }

                                                                                                                  // 📊 Weekly Statement Export
                                                                                                                  function downloadWeeklyStatement() {
                                                                                                                    const oneWeekAgo = new Date();
                                                                                                                      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                                                                                                                        const weeklyData = transactions.filter(t => new Date(t.date) >= oneWeekAgo);

                                                                                                                          if (weeklyData.length === 0) {
                                                                                                                              alert("No transactions for the past week!");
                                                                                                                                  return;
                                                                                                                                    }

                                                                                                                                      const worksheetData = [
                                                                                                                                          ["Type", "Description", "Amount", "Date", "Category"],
                                                                                                                                              ...weeklyData.map(t => [t.type, t.name, t.amount, t.date, t.category])
                                                                                                                                                ];

                                                                                                                                                  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
                                                                                                                                                    const wb = XLSX.utils.book_new();
                                                                                                                                                      XLSX.utils.book_append_sheet(wb, ws, "Weekly Statement");

                                                                                                                                                        XLSX.writeFile(wb, "Weekly_Statement.xlsx");
                                                                                                                                                        }

                                                                                                                                                        // Initial render
                                                                                                                                                        renderTransactions();