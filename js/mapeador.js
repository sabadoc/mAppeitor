
// TODO class file
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

// TODO class file
function readFile() {
    let _files;
    let _fileList;
    let _filesReadPromise = [];
    let _filesInput = document.getElementsByClassName('file-input');
    _filesInput = _.filter(_filesInput, (fileInput) => fileInput != undefined);
    if (_filesInput.length) {
        _files = _.map(_filesInput, input => input.files[0]);
        _files.forEach(file => _filesReadPromise.push(getFileContent(file)));

        Promise.all(_filesReadPromise).then(filesBlob => {
            _fileList = parseToCsv(filesBlob);
        }).catch( err => {
            console.error(err);
        });
    }
}

// TODO class file
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

// TODO class file
function parseToCsv(filesBlob) {
    let _fileResult = [];
    filesBlob.forEach(file => {
        _fileResult.push(getFileParse(file, ',')); // TODO create class file
    });
    return _fileResult;
}

// TODO class file
function getFileParse(fileBlob, delimiter) {
    let _rowsFile = [];
    let _fileByColumn = [];
    _rowsFile = fileBlob.split(/\n/).map(row => row.split(delimiter));
     _.forEach(_rowsFile[0], (title, indx) => {
        fileByColumn.push([]);
        _.forEach(_rowsFile, (row) => {
            _fileByColumn[indx].push(row[indx])
        })
    })
    return { content: _fileResult, header: _rowsFile[0]};
}

