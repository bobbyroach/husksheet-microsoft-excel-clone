let objects: { spreadsheet_id: number; value: number; row: number; column: number; }[] = [];
for(let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
        objects.push({
            spreadsheet_id: 1,
            value : i+j,
            row : i,
            column : j,
        });
    }
}   

export default objects;

