"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _objectDestructuringEmpty2 = _interopRequireDefault(require("@babel/runtime/helpers/objectDestructuringEmpty"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _medusaInterfaces = require("medusa-interfaces");
var fs = _interopRequireWildcard(require("fs"));
var _stream = _interopRequireDefault(require("stream"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var fetch = require('node-fetch');
var https = require('https');
function getReadStreamFromCDN(url) {
  return new Promise(function (resolve, reject) {
    https.get(url, function (response) {
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

// create medusajs file service which integrates with bunny cdn
var BunnyFileService = /*#__PURE__*/function (_FileService) {
  (0, _inherits2["default"])(BunnyFileService, _FileService);
  var _super = _createSuper(BunnyFileService);
  function BunnyFileService(_ref, pluginOptions) {
    var _this;
    (0, _objectDestructuringEmpty2["default"])(_ref);
    (0, _classCallCheck2["default"])(this, BunnyFileService);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "options", {
      storage: {
        storageUploadEndPoint: process.env.BUNNY_STORAGE_UPLOAD_ENDPOINT,
        apiKey: process.env.BUNNY_API_KEY,
        storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME,
        storagePath: process.env.BUNNY_STORAGE_PATH
      },
      cdn: {
        pullZoneEndPoint: process.env.BUNNY_PULLZONE_ENDPOINT
      }
    });
    if (pluginOptions) {
      _this.options = pluginOptions;
    }
    return _this;
  }

  // upload file to bunny cdn
  // @ts-ignore
  (0, _createClass2["default"])(BunnyFileService, [{
    key: "upload",
    value: function () {
      var _upload = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(fileData) {
        var url, readStream, options, uploadedUrl;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              url = "".concat(this.options.storage.storageUploadEndPoint, "/").concat(this.options.storage.storageZoneName, "/").concat(this.options.storage.storagePath, "/").concat(fileData.originalname);
              readStream = fs.createReadStream(fileData.path);
              options = {
                method: 'PUT',
                headers: {
                  'content-type': 'application/octet-stream',
                  AccessKey: this.options.storage.apiKey
                },
                body: readStream
              };
              _context.next = 6;
              return fetch(url, options);
            case 6:
              uploadedUrl = "".concat(this.options.cdn.pullZoneEndPoint, "/").concat(this.options.storage.storagePath, "/").concat(fileData.originalname);
              console.log(uploadedUrl);
              return _context.abrupt("return", {
                url: uploadedUrl
              });
            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](0);
              throw new Error(_context.t0);
            case 14:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[0, 11]]);
      }));
      function upload(_x) {
        return _upload.apply(this, arguments);
      }
      return upload;
    }() // @ts-ignore
  }, {
    key: "delete",
    value: function () {
      var _delete2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(fileData) {
        var url, options;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              url = "".concat(this.options.storage.storageUploadEndPoint, "/").concat(this.options.storage.storageZoneName, "/").concat(this.options.storage.storagePath, "/").concat(fileData.file_key);
              options = {
                method: 'DELETE',
                headers: {
                  AccessKey: this.options.storage.apiKey
                }
              };
              _context2.next = 5;
              return fetch(url, options);
            case 5:
              _context2.next = 10;
              break;
            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              throw new Error(_context2.t0);
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
              filePath = "".concat(this.options.storage.storageUploadEndPoint, "/").concat(this.options.storage.storageZoneName, "/").concat(this.options.storage.storagePath, "/").concat(name, ".").concat(ext);
              downloadFilePath = "".concat(this.options.cdn.pullZoneEndPoint, "/").concat(this.options.storage.storagePath, "/").concat(name, ".").concat(ext);
              pass = new _stream["default"].PassThrough();
              options = {
                method: 'PUT',
                headers: {
                  'content-type': 'application/octet-stream',
                  AccessKey: this.options.storage.apiKey
                },
                body: pass
              };
              return _context3.abrupt("return", {
                writeStream: pass,
                promise: fetch(filePath, options),
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
        var fileKey;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              fileKey = _ref3.fileKey;
              return _context4.abrupt("return", "".concat(fileKey));
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
      var _uploadProtected = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(fileData) {
        var filePath, readStream, options, uploadedUrl;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              // const filePath = `${this.protectedPath}/${fileData.originalname}`
              filePath = "".concat(this.options.storage.storageUploadEndPoint, "/").concat(this.options.storage.storageZoneName, "/").concat(this.options.storage.storagePath, "/").concat(fileData.originalname);
              readStream = fs.createReadStream(fileData.path);
              options = {
                method: 'PUT',
                headers: {
                  'content-type': 'application/octet-stream',
                  AccessKey: this.options.storage.apiKey
                },
                body: readStream
              };
              _context5.next = 5;
              return fetch(filePath, options);
            case 5:
              uploadedUrl = "".concat(this.options.cdn.pullZoneEndPoint, "/").concat(this.options.storage.storagePath, "/").concat(fileData.originalname);
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
        var fileKey, _ref4$isPrivate, isPrivate, readStream;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              fileKey = _ref4.fileKey, _ref4$isPrivate = _ref4.isPrivate, isPrivate = _ref4$isPrivate === void 0 ? true : _ref4$isPrivate;
              _context6.next = 3;
              return getReadStreamFromCDN(fileKey);
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