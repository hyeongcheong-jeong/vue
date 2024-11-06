import { Paging } from '@/resources/entity';

export default class DataParser {
  #inData;
  // parse 요청시 데이터를 저장 (재활용성 데이터로 인한 처리)
  #rtnData;
  constructor(result) {
    const _data = result || {};
    this.paging = new Paging(_data);
    this.#inData = result.data;
  }

  /**
   * inData와 넘겨받은 class 타입으로 converting 하여 return
   * paging 정보 parsing 하여 return
   * format: {
   *    data,
   *    paging
   * }
   * @param {*} _class
   */
  dataParse(_class) {
    this.#rtnData = this.dataConvert(this.#inData, _class);
    let rtn = {
      data: this.#rtnData,
      // BaseEntity에서 처리한 paging 값
      paging: this.paging,
    };

    /**
     * data가 Array형식이 아닐경우 class 에 값을 넣어준다.
     */
    if (!Array.isArray(this.#inData)) {
      rtn.class = this.#rtnData;
    }
    return rtn;
  }

  /**
   * Array일경우 각 item 마다 객체 Convert 해준다.
   * @param {*} _inData
   * @param {*} _inClass
   */
  dataConvert(_inData, _inClass) {
    if (Array.isArray(_inData)) {
      // data가 Array Type일 경우
      let _data = [];
      _inData.map((d) => {
        // _data.push(Object.getPrototypeOf(Object.create(_inClass)).constructor(d));
        const obj = Object.getPrototypeOf(Object.create(_inClass)).constructor(d);

        // masking 값 처리
        obj['masking'] = _inClass['masking'] || false;
        _data.push(obj);
        // console.log(Object.getPrototypeOf(Object.create(_inClass)).constructor(d));
      });
      return _data;
    } else {
      // data가 Object 일경우
      const obj = Object.getPrototypeOf(Object.create(_inClass)).constructor(_inData);
      obj['masking'] = _inClass['masking'] || false;
      return obj;
    }
  }
}