/**
 * Entity에 필요한 Base정의 class
 * TODO: 구조적인 리펙토리 해야함.
 */
export default class BaseEntity {
  #errors;
  #datas;
  validIgnore;
  masking;
  constructor() {
    this.#errors = [];
    this.#datas = {};
    this.validIgnore = [];
    this.masking = false;

    /**
     * validation 구분 enum
     */
    this.validEnum = {
      EMAIL: (val) => {
        const emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        return emailRule.test(val);
      },
      PHONE: (val) => {
        const phoneRule = /^\d{3}-\d{3,4}-\d{4}$/;
        return phoneRule.test(val);
      },
      TEXTSIZE: (val, size) => {
        let b, i, c;
        for (b = i = 0; (c = val.charCodeAt(i++)); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);

        return b <= size ? true : false;
      },
      PASSWORD: (val) => {
        let passRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
        return passRule.test(val);
      },
      NUMBER: (val) => {
        let numRule = /^[0-9]*$/;
        return numRule.test(val);
      },
      KOREAN: (val) => {
        let korRule = /^[a-z0-9]|[ \\[\]{}()<>?|`~!@#$%^&*-_+=,.;:\\"'\\]/g;
        return !korRule.test(val);
      },
      ENGLISH: (val) => {
        let engRule = /^[A-Za-z]/g;
        return engRule.test(val);
      },
      ONLYTEXT: (val) => {
        let textRule = /^[0-9]|[ \\[\]{}()<>?|`~!@#$%^&*-_+=,.;:\\"'\\]/g;
        return !textRule.test(val);
      },
      DATE: (val) => {
        let dateRule = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;
        return dateRule.test(val);
      },
      TIME: (val) => {
        let timeRule = /^([1-9]|[01][0-9]|2[0-3]):([0-5][0-9])$/;
        return timeRule.test(val);
      },
      DATETIME: (val) => {
        let dateTimeRule = /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])\s([1-9]|[01][0-9]|2[0-3]):([0-5][0-9])$/;
        return dateTimeRule.test(val);
      },
      // TODO : 회원정책나오면 수정해야함 20-12-30
      ID: (val) => {
        console.log(val);
        return true;
      },
      EMPTY: (val) => {
        // return val === undefined || val === '' ? false : true;
        return val === undefined || val === '' || val.length === 0 ? false : true;
      },
      NONE: (val) => {
        // setter를 강제 구현해야 하지만 validation은 필요 없는 경우
        //console.log(val);
        // 강제로 써야 해서 어쩔 수 없음 -_- ㅋㅋㅋㅋㅋㅋㅋㅋ
        let x = val === '' ? '' : '';

        return x === '';
      },
    };

    // masking enum
    this.maskEnum = {
      ID: (val) => {
        if (typeof val === 'undefined' || val == '' || val == null) {
          // id 없는 경우
          return val;
        } else {
          if (/@/g.test(val)) {
            //email형식 ID인 경우
            return this.EMAIL(val);
          } else if (val.length <= 3) {
            // email형식도 아니고 length도 3이하인 경우 그냥 반환
            // 근데 아마 여기 타는일 없을 거임
            return val;
          } else {
            //인경우 뒷자리 3글자 반환
            return val.substr(0, val.length - 3) + '***';
          }
        }
      },
      // 이메일 아이디 뒤 3자리만 마스킹 처리
      EMAIL: (val) => {
        let em = val.split('@');
        if (em.length > 1) {
          return em[0].substr(0, em[0].length - 3) + '***@' + em[1];
        } else {
          return val;
        }
      },
      // 폰번호 가운데 자리만 마스킹
      PHONE: (val) => {
        if (val.replace(/-/g, '').length === 10) {
          return val.replace(/(\d{3})-?(\d{3})-?(\d{4})/gi, '$1-***-$3');
        } else {
          return val.replace(/(\d{3})-?(\d{4})-?(\d{4})/gi, '$1-****-$3');
        }
      },
      ADDRESS: (val) => {
        return val.replace(
          /((([가-힣]+(\d{1,5}|\d{1,5}(,|.)\d{1,5}|)+(읍|면|동|가|리))(^구|)((\d{1,5}(~|-)\d{1,5}|\d{1,5})(가|리|)|))([ ](산(\d{1,5}(~|-)\d{1,5}|\d{1,5}))|)|(([가-힣]|(\d{1,5}(~|-)\d{1,5})|\d{1,5})+(로|길)))(.*)/gi,
          '$1 **********',
        );
      },
      /* ADDRESS: val => {
        '(([\uac00-\ud7af]|(\d{1,5}(~|-)\d{1,5})|\d{1,5})+(\uB85C|\uAE38))'
      } */
      /**
       * 3/4 자 가운데 1글자
       * 2 자 앞 1자
       * 5자 이상 글자뒤 1/3
       * @param {*} val
       */
      NAME: (val) => {
        if (typeof val === 'undefined' || val == '' || val == null) {
          // id 없는 경우
          return val;
        } else if (val.length === 2) {
          return '*' + val.substr(1, 1);
        } else if (val.length === 3) {
          return val.substr(0, 1) + '*' + val.substr(2, 1);
        } else if (val.length === 4) {
          return val.substr(0, 2) + '*' + val.substr(3, 1);
        } else if (val.length >= 5) {
          const size = Math.ceil(val.length / 3);
          let rtn = val.substr(0, val.length - size);

          for (let i = 0; i < size; i++) {
            rtn += '*';
          }
          return rtn;
        } else {
          return val;
        }
      },
      // 전체 마스킹
      ALL: () => {
        return '*******';
      },
    };
  }

  /**
   * validation 체크 및
   * 자식 class field의 데이터 값에 대한 get, set method를
   * override methods 처럼 보이도록 변형한 method
   * !!! 절대 override는 아님.
   * @param {*} obj {
   *  field: string,
   *  valid: validEnum,
   *  value: string,
   *  size: number
   * }
   */
  toSet(obj) {
    // console.log(obj);
    // console.log(this.#ignore.indexOf(obj.field));
    // validation 예외처리인지 확인 후 validation 처리.
    if (this.validIgnore.indexOf(obj.field) === -1) {
      // 입력 field가 현재 error 상태인지 확인
      const fieldIdx = this.#errors.findIndex((i) => {
        return i.key === obj.field && i.valid === obj.valid;
      });

      /**
       * validation 체크 여부에 따라
       * error 로 카운팅 처리.
       */
      if (obj.valid(obj.value, obj.size)) {
        if (fieldIdx > -1) {
          this.#errors.splice(fieldIdx, 1);
        }
      } else {
        if (fieldIdx < 0) {
          this.#errors.push({
            key: obj.field,
            msg: obj.msg,
            valid: obj.valid,
          });
        }
      }
    }

    // console.log('BaseEntity', this.validIgnore, this.#errors);

    this.#datas[obj.field] = obj.value;
  }

  /**
   * toSet을 통해 입력된 데이터 반환
   * @param {*} key
   */
  toGet(key, mask) {
    // console.log(this.masking, this.#datas[key]);
    if (this.masking && mask !== undefined) {
      return mask(this.#datas[key]);
    } else {
      return this.#datas[key];
    }
  }

  toErrCount() {
    return this.#errors.length;
  }

  toError() {
    return this.#errors;
  }

  toParam(param) {
    return {
      params: param,
    };
  }

  /**
   * validation 예외 처리할 값 넣기
   * @param {*} vals Array Type
   */
  setIgnore(vals) {
    // console.log(vals);

    // let err = this.#errors.reduce(function(a, b) {
    //   console.log(a, b);
    //   if (a.key !== b.key) {
    //     a.push(b);
    //   }
    //   return a;
    // });

    // console.log(err);

    this.#errors.length = 0;

    // Object.assign(this.#errors, err);

    for (let i in vals) {
      const igIdx = this.validIgnore.findIndex((i) => {
        return i === vals[i];
      });

      if (igIdx === -1) {
        this.validIgnore.push(vals[i]);
      }

      // validation 예외 값이 #Errors에 존재할경우 삭제해준다.
      const fieldIdx = this.#errors.findIndex((f) => {
        return f.key === vals[i];
      });

      /**
       * validation 체크 여부에 따라
       * error 로 카운팅 처리.
       */
      if (fieldIdx > -1) {
        this.#errors.splice(fieldIdx, 1);
      }
    }
  }

  // validation ignore 된 목록
  getIgnore() {
    return this.validIgnore;
  }

  toSetFormat() {
    return {
      field: '',
      valid: this.validEnum,
      value: '',
      msg: '',
      size: 0,
    };
  }

  // masking 처리
  isMasking() {
    this.masking = true;
  }
  // masking 처리안함
  isUnMasking() {
    this.masking = false;
    // console.log(this.masking);
  }

  // -1 값 들어오는 경우 존재하여 추가 (ex. 중고차 상세 인스펙션 createDateTime)
  longToDate(val) {
    if (val <= 0 || val === undefined || val === null) {
      return '-';
    }

    let date = new Date(val); //입력 파라메터로 Date 객체를 생성합니다
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

  longToDateTime(val) {
    if (val === undefined || val === null) {
      return '-';
    }

    // const offset = new Date().getTimezoneOffset() * 1000 * 60;
    // const getLocalDate = (value) => {
    //   const offsetDate = new Date(value).valueOf() - offset;
    //   const date = new Date(offsetDate).toISOString();
    //   return date.substring(0, 16);
    // };

    // return getLocalDate(val);

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

  dateToLong(val) {
    return new Date(val) * 1;
  }
  // search용 날짜로 계속 사용예정
  // search용 날짜로 계속 사용예정
  startDateToLong(val) {
    if (val === undefined || val === '') {
      return '';
    }

    let date = new Date(val); //입력 파라메터로 Date 객체를 생성합니다
    // let date = new Date(inD.toUTCString());
    let yyyy = date.getFullYear().toString(); // '연도'를 뽑아내고
    let mm = (date.getMonth() + 1).toString(); // '월'을 뽑아내고
    let dd = date.getDate().toString(); // '일'을 뽑아냅니다

    let Str = '';

    //스트링 배열의 앞자리가 두자리 수가 아닌 한자리 수일 경우
    // 두자리로 표시하기 위해 0을 채웁니다(lpad 와 동일한 역할)
    // (ex : '1' -> '01' )
    Str += yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]);

    return new Date(`${Str}T00:00:00`) * 1;
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

    //스트링 배열의 앞자리가 두자리 수가 아닌 한자리 수일 경우
    // 두자리로 표시하기 위해 0을 채웁니다(lpad 와 동일한 역할)
    // (ex : '1' -> '01' )
    Str += yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]);

    return new Date(`${Str}T23:59:59`) * 1;
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

  random() {
    return parseInt(Date.now() + Math.random() * 10000000)
      .toString(16)
      .slice(-6);
  }

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
}