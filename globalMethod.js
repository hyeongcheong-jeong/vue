/**
 * 공통 함수 class
 */
import Notification from './Notification';
import { Response } from '@/resources/entity';
import store from '@/resources/store';
import { Loading } from '@/resources/plugins';

export default class GlobalMethods {
  constructor() {
    this._noti = new Notification();
  }

  youtubeReplace(url) {
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#/&/?]*).*/;
    let matchs = url.match(regExp);

    let youtubeId;

    if (matchs) {
      youtubeId = matchs[7];
    }

    return youtubeId;
  }

  tagReplace(txt) {
    return txt
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\n/g, '<br/>')
      .replace(/&quot;/g, '"');
  }

  getCurrentTime() {
    let now = new Date();
    let res = '' + now.getFullYear() + this.padZero(now.getMonth() + 1) + this.padZero(now.getDate()) + this.padZero(now.getHours()) + this.padZero(now.getMinutes()) + this.padZero(now.getSeconds());
    return res;
  }

  padZero(num) {
    return (num < 10 ? '0' : '') + num;
  }

  loadingStart() {
    Loading.$emit('showHideLoading', true);
  }

  loadingStop() {
    Loading.$emit('showHideLoading', false);
  }

  // trim
  trim(val) {
    return val.trim();
  }

  // 랜덤값 생성
  random() {
    return parseInt(Date.now() + Math.random() * 10000000)
      .toString(16)
      .slice(-6);
  }

  zoneTimer() {
    const curr = new Date();
    const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;

    // 3. UTC to KST (UTC + 9시간)
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const kr_curr = new Date(utc + KR_TIME_DIFF);

    const monString = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return {
      day: kr_curr.getDate(),
      hour: kr_curr.getHours(),
      minute: kr_curr.getMinutes() < 10 ? `0${kr_curr.getMinutes()}` : kr_curr.getMinutes(),
      month: monString[kr_curr.getMonth()],
    };
  }

  // 금액 콤마 처리
  comma(num) {
    return num === undefined ? '' : num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // 날짜 데이터 format (default: YYYY-MM-DD)
  dateFormat(date, type) {
    const formatType = type === undefined || type === null ? '-' : type;
    return date.substring(0, 4) + formatType + date.substring(4, 6) + formatType + date.substring(6, 8);
  }

  // 날짜 시간 format
  dateTimeFormat(datetime, type) {
    if (datetime.length === 14) {
      const date = this.cmm_dateFormat(datetime.substring(0, 8), type);
      const time = datetime.substring(8, 10) + ':' + datetime.substring(10, 12) + ':' + datetime.substring(12, 14);
      return date + ' ' + time;
    }
    return datetime;
  }

  // 배열 데이터 복사
  cloneObj(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // notification
  get noti() {
    return this._noti;
  }

  // axios response 객체화 처리
  responseParse(dataArea, _data, _class) {
    // return new Response(_data).data.parse(_class);
    Object.assign(dataArea, new Response(_data).parse(_class));
  }

  /**
   * logout 처리를 store에 직접 개발자가 접근하지 않고 한곳에서 사용하기 위해
   * 별도로 로그아웃 요청처리 메소드 분리함.
   */
  logout() {
    store.dispatch('auth/logout');
  }

  endDateToLong(val) {
    if (val === undefined || val === '') {
      return '';
    }

    let date = new Date(val); //입력 파라메터로 Date 객체를 생성합니다
    // let date = new Date(inD.toUTCString());
    let yyyy = date.getFullYear().toString(); // '연도'를 뽑아내고
    let mm = (date.getMonth() + 1).toString(); // '월'을 뽑아내고
    let dd = date.getDate().toString(); // '일'을 뽑아냅니다

    let Str = '';
    Str += yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]);

    //스트링 배열의 앞자리가 두자리 수가 아닌 한자리 수일 경우
    // 두자리로 표시하기 위해 0을 채웁니다(lpad 와 동일한 역할)
    // (ex : '1' -> '01' )

    return new Date(`${Str}T23:59:59`) * 1;
  }

  // -1 값 들어오는 경우 존재하여 추가 (ex. 중고차 상세 인스펙션 createDateTime)
  longToDate(val) {
    if (val <= 0 || val === undefined || val === '') {
      return '-';
    }

    let inD = new Date(val); //입력 파라메터로 Date 객체를 생성합니다
    let date = new Date(inD.toUTCString());
    let yyyy = date.getFullYear().toString(); // '연도'를 뽑아내고
    let mm = (date.getMonth() + 1).toString(); // '월'을 뽑아내고
    let dd = date.getDate().toString(); // '일'을 뽑아냅니다

    let Str = '';

    //스트링 배열의 앞자리가 두자리 수가 아닌 한자리 수일 경우
    // 두자리로 표시하기 위해 0을 채웁니다(lpad 와 동일한 역할)
    // (ex : '1' -> '01' )
    Str += yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]);

    return Str;
  }

  // mypage order detail에서 파일 관련 시간 표현하는데 사용
  longToDateTime3(val) {
    if (val === undefined || val === '') {
      return '-';
    }

    let inD = new Date(val); //입력 파라메터로 Date 객체를 생성합니다
    let date = new Date(inD.toUTCString());
    let yyyy = date.getFullYear().toString(); // '연도'를 뽑아내고
    let mm = (date.getMonth() + 1).toString(); // '월'을 뽑아내고
    let dd = date.getDate().toString(); // '일'을 뽑아냅니다
    let hh = date.getHours().toString(); // '시간'을 뽑아냅니다
    let mmm = date.getMinutes().toString(); // '분'을 뽑아냅니다.

    let Str = '';

    //스트링 배열의 앞자리가 두자리 수가 아닌 한자리 수일 경우
    // 두자리로 표시하기 위해 0을 채웁니다(lpad 와 동일한 역할)
    // (ex : '1' -> '01' )
    Str += yyyy + '.' + (mm[1] ? mm : '0' + mm[0]) + '.' + (dd[1] ? dd : '0' + dd[0]) + ' ' + (hh[1] ? hh : '0' + hh[0]) + ':' + (mmm[1] ? mmm : '0' + mmm[0]);

    return Str;
  }

  longToDateTime2(val) {
    if (val === undefined || val === '') {
      return '-';
    }

    let inD = new Date(val); //입력 파라메터로 Date 객체를 생성합니다
    let date = new Date(inD.toUTCString());
    let yyyy = date.getFullYear().toString(); // '연도'를 뽑아내고
    let mm = (date.getMonth() + 1).toString(); // '월'을 뽑아내고
    let dd = date.getDate().toString(); // '일'을 뽑아냅니다
    let time = date.toLocaleTimeString();

    let Str = '';

    //스트링 배열의 앞자리가 두자리 수가 아닌 한자리 수일 경우
    // 두자리로 표시하기 위해 0을 채웁니다(lpad 와 동일한 역할)
    // (ex : '1' -> '01' )
    Str += yyyy + (mm[1] ? mm : '0' + mm[0]) + (dd[1] ? dd : '0' + dd[0]) + time;

    return Str;
  }

  longToDateTime(val) {
    if (val === undefined || val === '') {
      return '-';
    }

    let inD = new Date(val); //입력 파라메터로 Date 객체를 생성합니다
    let date = new Date(inD.toUTCString());
    let yyyy = date.getFullYear().toString(); // '연도'를 뽑아내고
    let mm = (date.getMonth() + 1).toString(); // '월'을 뽑아내고
    let dd = date.getDate().toString(); // '일'을 뽑아냅니다
    let time = date.toLocaleTimeString('en-US');

    let Str = '';

    //스트링 배열의 앞자리가 두자리 수가 아닌 한자리 수일 경우
    // 두자리로 표시하기 위해 0을 채웁니다(lpad 와 동일한 역할)
    // (ex : '1' -> '01' )
    Str += yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]) + ' ' + time;

    return Str;
  }

  char2convert(v, d) {
    let dd = '0';

    if (d !== undefined) {
      dd = d;
    }

    let vv = v;

    if (Number(v) < 10) {
      return dd + vv;
    } else {
      return vv;
    }
  }

  dateToLong(val) {
    return new Date(val) * 1;
  }

  createSubCode(code, num) {
    let c = code;
    let n = Number(num.replace(code));

    return `${c}${n.padStart(4, '0')}`;
  }

  queryStringParse(p) {
    let qu = '';
    let gs = '';
    let num = 0;
    for (const key in p) {
      gs = num === 0 ? '?' : '&';

      if (p[key] === undefined || p[key] === '') {
        continue;
      }

      if (p[key] !== undefined && p[key].toString().indexOf('[') > -1) {
        const ps = p[key].replace('[', '').replace(']', '');
        // const pss = ps.split(',');
        // for (let i = 0; i < pss.length; i++) {
        //   qu += `${gs}${key}=${pss[i]}`;
        // }
        qu += `${gs}${key}=${ps}`;
      } else {
        qu += `${gs}${key}=${p[key] === undefined ? '' : p[key]}`;
      }

      num += 1;
    }

    return qu;
  }

  /**
   *
   * @param { } maxWidth
   * @param {*} maxHeight
   * @return boolean
   */
  imageCheck(file, maxWidth, maxHeight, callback) {
    let _URL = window.URL || window.webkitURL;
    let img = new Image();

    img.onload = function () {
      if (!maxWidth) {
        maxWidth = 10000000;
      }
      if (!maxHeight) {
        maxHeight = 10000000;
      }

      //console.log(this.width);
      //console.log(this.height);
      if (this.width > maxWidth || this.height > maxHeight) {
        // TODO : alert 문구 변경해야 함
        alert('넓이가 ' + maxWidth + 'px 이하인 파일만 등록 가능합니다.');
      } else {
        callback();
      }
    };

    img.src = _URL.createObjectURL(file);
  }

  /**
   * ex) this.commons.getPrivacyYnIfNull.call(this);
   * 권한 가져오기 호출 -_ - mixin 처리 현재 상황에선
   * 새로고침시 값을 나중에 가져오는 케이스가 있음
   *
   * 현재 상황에서는 이에 대해 없을 시 불러와야 함
   */
  async getPrivacyYnIfNull() {
    var privacyYn = this.$store.getters['customCode/getPrivacyAuthYn'] || '';

    if (privacyYn != '') {
      return privacyYn;
    } else {
      return new Promise((resolve) => {
        // Promise 객체를 반환합니다.
        //setTimeout(
        this.axios.async
          .get('/adminmenu/listWithAuth')
          .then((result) => {
            resolve(result.data.data.handlePersonalInfoYn || 'N');
          })
          .catch((err) => {
            resolve('ERROR');
            console.log(err);
          });
        //), 200);
      });
    }
  }

  /**
   * Admin AuthGroup을 가져와서 메뉴차단
   * @returns
   */
  async getAdminAuthGroup() {
    var adminAuthGroup = this.$store.getters['customCode/getAdminAuthGroup'] || '';

    if (adminAuthGroup != '') {
      return adminAuthGroup;
    } else {
      return new Promise((resolve) => {
        // Promise 객체를 반환합니다.
        //setTimeout(
        this.axios.async
          .get('/adminmenu/listWithAuth')
          .then((result) => {
            resolve(result.data.data.adminAuthGroup || 'PRODUCTS');
          })
          .catch((err) => {
            resolve('ERROR');
            console.log(err);
          });
        //), 200);
      });
    }
  }

  /**
   * Class 지원이 힘든 경우 force 방식의 지원
   * @param {*} privacyYn  - Y인 경우 그냥 val 반환
   * @param {*} val        - 마스킹 처리 대상 값
   * @param {*} maskEnum   - N인 경우 마스킹 대상이 되는 Enum
   */
  forceMaskingVariable(privacyYn, val, maskEnum) {
    if (privacyYn == 'Y') {
      return val;
    } else {
      return maskEnum(val);
    }
  }

  /**
   * 연속된 문자처리 제한(비밀번호 체크시 123, abc같은거 제한할때 스임)
   * @param {*} str
   * @param {*} limit
   */
  checkPassValidateStream(str, limit) {
    var o,
      d,
      p,
      n = 0,
      l = limit == null ? 4 : limit;
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      if (i > 0 && (p = o - c) > -2 && p < 2 && (n = p == d ? n + 1 : 0) > l - 3) return false;
      (d = p), (o = c);
    }

    return true;
  }

  /**
   * 어떠한 경우에도 getPrivacyYnIfNull 이외에 호출하지 말것!
   * this는 getPrivacyYnIfNull에서 받아온 vue가 this가 된다.
   */
  /* async _callPrivacyYnDirect() {
    
  } */
  /**
   * 전화번호 포맷팅처리
   * @param  num
   * @returns
   */
  phoneNumberSetting(num = '') {
    let replaceNum = num.replace(/-/g, '');
    if (replaceNum.length === 6) {
      return replaceNum.replace(/([0-9]{2})([0-9]{4})/, '$1-$2');
    } else if (replaceNum.length === 7) {
      return replaceNum.replace(/([0-9]{3})([0-9]{4})/, '$1-$2');
    } else if (replaceNum.length === 9) {
      return replaceNum.replace(/([0-9]{2}|[0-9]{3})([0-9]{3})([0-9]{4})/, '$1-$2-$3');
    } else return replaceNum.replace(/(^02.{0}|^10.{0}|[0-9]{3})([0-9]{4})([0-9]{4})/, '$1-$2-$3');
  }

  //TODO : 최성진 선배님 요청에 따라 검색용 dateToLong 펑션 추가 -다혜
  searchStartDate(val) {
    if (val === undefined || val === '') {
      return '';
    } else {
      return this.dateToLong(val + 'T00:00:00');
    }
  }
  searchEndDate(val) {
    if (val === undefined || val === '') {
      return '';
    } else {
      return this.dateToLong(val + 'T23:59:59');
    }
  }

  isNull(val) {
    return val == '' || val == null || val == undefined || (val != null && typeof val == 'object' && !Object.keys(val).length);
  }
  /*
    2023-03-22 이미지 액박시에 대체 이미지 method 추가
    2023-03-24 대체 이미지 사이즈별 분기 처리 (small , large)
    2023-03-29 대체 이미지 국가별 적용(large size만 해당)
  */
  isThumbDefault(e) {
    e.target.src.indexOf('large') > 0 ? (e.target.src = require('@/assets/images/common/ResizeProc_large.gif')) : (e.target.src = require('@/assets/images/common/ResizeProc.png'));
  }
}