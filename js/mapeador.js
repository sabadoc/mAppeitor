let fileList = ( () => {
    let _list = [];
    function addFile(file) {
        _list.add(file);
    }
    function removeFile(index) {
        _list.splice(index, 1);
    }
    return {
       add: (file) =>  addFile(file),
       remove: (index) => removeFile(index),
       get: (index) => (index < _list.length - 1) ? _list[index] : null
    }
});

function readFile() {
    let _files;
    let _fileList;
    let _filesReadPromise = [];
    let _filesInput = document.getElementsByClassName('file-input');
    _filesInput = _.filter(_filesInput, (fileInput) => fileInput != undefined);
    if (_filesInput.length) {
        _files = _.map(_filesInput, input => input.files[0]);
        _files.forEach(file => {
            if (file) {
                _filesReadPromise.push(getFileContent(file));
            }
        });

        Promise.all(_filesReadPromise).then(filesBlob => {
            _fileList = parseToCsv(filesBlob);
        }).catch( err => {
            console.error(err);
        });
    }
}

function getFileContent(file) {
    let _file = file;
    let _start = 0;
    let _stop = _file.size - 1;
    let _reader = new FileReader();
    let _blob = _file.slice(_start, _stop + 1);
    let _promise;    

    _promise = new Promise((resolve, reject) => { 
        _reader.onloadend = evt => {
            if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                resolve(evt.target.result);
            } else {
                reject();// TODO add err info
            }
        };
    })
    _reader.readAsBinaryString(_blob);
    return _promise;

}

function parseToCsv(filesBlob) {
    let _fileResult = [];
    filesBlob.forEach(file => {
        //_fileResult.push(getFileParse(file, ';')); // TODO create class file
        _fileResult.push(getLogsParse(file, ';', '|')); // logApex create class file
    });
    return _fileResult;
}

function getFileParse(fileBlob, delimiter) {
    let _rowsFile = [];
    let _header = [];
    let _fileContent = [];

    _rowsFile = fileBlob.split(/\n/);
    _header = _rowsFile.splice(0,1)[0].split(delimiter);
    _rowsFile.forEach(row => {
        var _obj = {};
        row.split(delimiter).forEach((attr, indx) => {
            _obj[_header[indx]] = attr;
        });

        _fileContent.push(_obj);
    })

    return { content: _fileContent, header: _header};
}

function parseColumnToStringQueryList(rows) {
    var _stringQuery= '';
    rows.forEach(value => {
        _stringQuery += "'" + value + "',";
    });
    return _stringQuery;
}

function getLogsParse(fileBlob, delimiter, delimiterBody = ';') {
    let _rowsFile = [];
    let _header = [];
    let _fileContent = [];

    _rowsFile = fileBlob.split(/\n/);
    _header = _rowsFile.splice(0,1)[0].split(delimiter);
    _rowsFile.forEach(row => {
        var _obj = {};

        _obj = row.split(delimiterBody);
        _fileContent.push(_obj);
    })

    return { content: getLogInfo(_fileContent), header: _header};
}

function getLogInfo(content) {
    var result = [];
    content.forEach((row, idx) => {
        switch (row[1]) {
            /*case 'SOQL_EXECUTE_BEGIN':
                result.push({
                    row: idx,
                    soqlUsage: content[idx + 1][4],
                    sql: row[4],
                    rowInfo: row
                });
                break;*/
            case 'DML_BEGIN':
                result.push({
                    row: idx,
                    dmlUsage: content[idx + 1][4],
                    sql: row[4],
                    rowInfo: row
                });
                break;
            default:
                break;
        }
    });
    return result;
}

function groupByQuery(result) {
    var listAgrupated = {};
    result.forEach(row => {
        if (listAgrupated[row.sql]) {
            listAgrupated[row.sql].total =  listAgrupated[row.sql].total + 1;
            listAgrupated[row.sql].rows.push(row.row);
        } else {
            listAgrupated[row.sql] = {};
            listAgrupated[row.sql].total =  0;
            listAgrupated[row.sql].rows = [];
            listAgrupated[row.sql].rows.push(row.row);
        }
    });
}