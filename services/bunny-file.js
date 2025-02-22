"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _objectDestructuringEmpty2 = _interopRequireDefault(require("@babel/runtime/helpers/objectDestructuringEmpty"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _medusaInterfaces = require("medusa-interfaces");
var _fs = _interopRequireDefault(require("fs"));
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
var _stream = _interopRequireDefault(require("stream"));
var _https = _interopRequireDefault(require("https"));
var _path = require("path");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function getReadStreamFromCDN(url) {
  return new Promise(function (resolve, reject) {
    _https["default"].get(url, function (response) {
      if (response.statusCode !== 200) {
        reject(new Error("Failed to get file from CDN. Status Code: ".concat(response.statusCode)));
        return;
      }
      resolve(response);
    }).on('error', function (err) {
      reject(err);
    });
  });
}
var BunnyFileService = /*#__PURE__*/function (_FileService) {
  (0, _inherits2["default"])(BunnyFileService, _FileService);
  var _super = _createSuper(BunnyFileService);
  function BunnyFileService(_ref, options) {
    var _this;
    (0, _objectDestructuringEmpty2["default"])(_ref);
    (0, _classCallCheck2["default"])(this, BunnyFileService);
    _this = _super.call(this, {}, options);
    _this.storageAccessKey_ = options.storageAccessKey || ''; // Bunny Storage Access Key (FTP Password)
    _this.storageEndpoint_ = options.storageEndpoint || ''; // Bunny Storage Endpoint (e.g. storage.bunnycdn.com)
    _this.storageZoneName_ = options.storageZoneName || ''; // Bunny Storage Zone Name
    _this.storagePath_ = options.storagePath || ''; // (optional) File Path
    _this.pullZoneDomain_ = options.pullZoneDomain || ''; // Bunny Pull Zone Domain
    return _this;
  }

  // upload file to bunny cdn
  (0, _createClass2["default"])(BunnyFileService, [{
    key: "upload",
    value: function () {
      var _upload = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(file) {
        var parsedFilename, uploadFilename, uploadUrl, readStream, options, uploadedUrl;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              parsedFilename = (0, _path.parse)(file.originalname);
              uploadFilename = "".concat(parsedFilename.name, "-").concat(Date.now()).concat(parsedFilename.ext);
              _context.prev = 2;
              uploadUrl = "".concat(this.storageEndpoint_, "/").concat(this.storageZoneName_, "/").concat(this.storagePath_ ? this.storagePath_ + '/' : '').concat(uploadFilename);
              readStream = _fs["default"].createReadStream(file.path);
              options = {
                method: 'PUT',
                headers: {
                  'content-type': 'application/octet-stream',
                  AccessKey: this.storageAccessKey_
                },
                body: readStream
              };
              _context.next = 8;
              return (0, _nodeFetch["default"])(uploadUrl, options);
            case 8:
              uploadedUrl = "".concat(this.pullZoneDomain_, "/").concat(this.storagePath_ ? this.storagePath_ + '/' : '').concat(uploadFilename);
              return _context.abrupt("return", {
                url: uploadedUrl
              });
            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](2);
              throw _context.t0;
            case 15:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[2, 12]]);
      }));
      function upload(_x) {
        return _upload.apply(this, arguments);
      }
      return upload;
    }() // delete file from bunny CDN
  }, {
    key: "delete",
    value: function () {
      var _delete2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(file) {
        var deleteUrl, options;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              deleteUrl = "".concat(this.storageEndpoint_, "/").concat(this.storageZoneName_, "/").concat(this.storagePath_ ? this.storagePath_ + '/' : '').concat(file.file_key);
              options = {
                method: 'DELETE',
                headers: {
                  AccessKey: this.storageAccessKey_
                }
              };
              _context2.next = 5;
              return (0, _nodeFetch["default"])(deleteUrl, options);
            case 5:
              _context2.next = 10;
              break;
            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              throw _context2.t0;
            case 10:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[0, 7]]);
      }));
      function _delete(_x2) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }, {
    key: "getUploadStreamDescriptor",
    value: function () {
      var _getUploadStreamDescriptor = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref2) {
        var name, ext, _ref2$isPrivate, isPrivate, filePath, downloadFilePath, pass, options;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              name = _ref2.name, ext = _ref2.ext, _ref2$isPrivate = _ref2.isPrivate, isPrivate = _ref2$isPrivate === void 0 ? true : _ref2$isPrivate;
              filePath = "".concat(this.storageEndpoint_, "/").concat(this.storageZoneName_, "/").concat(this.storagePath_ ? this.storagePath_ + '/' : '').concat(name, ".").concat(ext);
              downloadFilePath = "".concat(this.pullZoneDomain_, "/").concat(this.storagePath_ ? this.storagePath_ + '/' : '').concat(name, ".").concat(ext);
              pass = new _stream["default"].PassThrough();
              options = {
                method: 'PUT',
                headers: {
                  'content-type': 'application/octet-stream',
                  AccessKey: this.storageAccessKey_
                },
                body: pass
              };
              return _context3.abrupt("return", {
                writeStream: pass,
                promise: (0, _nodeFetch["default"])(filePath, options),
                url: "".concat(downloadFilePath),
                fileKey: downloadFilePath
              });
            case 6:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function getUploadStreamDescriptor(_x3) {
        return _getUploadStreamDescriptor.apply(this, arguments);
      }
      return getUploadStreamDescriptor;
    }()
  }, {
    key: "getPresignedDownloadUrl",
    value: function () {
      var _getPresignedDownloadUrl = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref3) {
        var file;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              file = _ref3.file;
              return _context4.abrupt("return", "".concat(file));
            case 2:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function getPresignedDownloadUrl(_x4) {
        return _getPresignedDownloadUrl.apply(this, arguments);
      }
      return getPresignedDownloadUrl;
    }()
  }, {
    key: "uploadProtected",
    value: function () {
      var _uploadProtected = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(file) {
        var filePath, readStream, options, uploadedUrl;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              filePath = "".concat(this.storageEndpoint_, "/").concat(this.storageZoneName_, "/").concat(this.storagePath_ ? this.storagePath_ + '/' : '').concat(file.originalname);
              readStream = _fs["default"].createReadStream(file.path);
              options = {
                method: 'PUT',
                headers: {
                  'content-type': 'application/octet-stream',
                  AccessKey: this.storageAccessKey_
                },
                body: readStream
              };
              _context5.next = 5;
              return (0, _nodeFetch["default"])(filePath, options);
            case 5:
              uploadedUrl = "".concat(this.pullZoneDomain_, "/").concat(this.storagePath_ ? this.storagePath_ + '/' : '').concat(file.originalname);
              return _context5.abrupt("return", {
                url: "".concat(uploadedUrl),
                key: "".concat(uploadedUrl)
              });
            case 7:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function uploadProtected(_x5) {
        return _uploadProtected.apply(this, arguments);
      }
      return uploadProtected;
    }()
  }, {
    key: "getDownloadStream",
    value: function () {
      var _getDownloadStream = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(_ref4) {
        var file, _ref4$isPrivate, isPrivate, readStream;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              file = _ref4.file, _ref4$isPrivate = _ref4.isPrivate, isPrivate = _ref4$isPrivate === void 0 ? true : _ref4$isPrivate;
              _context6.next = 3;
              return getReadStreamFromCDN(file);
            case 3:
              readStream = _context6.sent;
              return _context6.abrupt("return", readStream);
            case 5:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      function getDownloadStream(_x6) {
        return _getDownloadStream.apply(this, arguments);
      }
      return getDownloadStream;
    }()
  }]);
  return BunnyFileService;
}(_medusaInterfaces.FileService);
var _default = exports["default"] = BunnyFileService;