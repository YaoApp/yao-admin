
function NextDay(day) {
	today = new Date(day);
	today.setDate(today.getDate() + 1);
	return today.toISOString().slice(0, 19).split("T")[0];
}
