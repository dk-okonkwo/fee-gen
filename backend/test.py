from datetime import datetime, timedelta

actual = 5
today = datetime.today()
start_date = today.replace(
    day=5) - timedelta(days=31)  # approx 5th
diff = start_date.day - actual
# correct to 5th of last month
start = today.replace(day=5) - timedelta(days=(31+(diff)))
end = today.replace(day=4)  # 4th of this month

cell_value = "04/01/2024"

date_value = datetime.strptime(cell_value, '%m/%d/%Y')


print(start, end)
print(start <= date_value <= end)