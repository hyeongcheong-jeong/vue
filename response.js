/**
 * 통신 공통 Response class
 * TODO: Validation 별도로 처리를 해주어야함.
 */
import DataParser from '@/resources/entity/global/DataParser';

export default class Response extends DataParser {
  constructor(result) {
    super(result.data || {});
    // 처리 상태
    this.status = result.status;

    this.headers = result.headers || {};

    // result data 영역 분리
    const _data = result.data || {};

    // format 에 맞는 추가
    this.startTime = _data.startTime || 0;
    this.endTime = _data.endTime || 0;
    this.success = _data.success || '';
  }

  parse(_class) {
    let rtnObject = this.dataParse(_class);
    rtnObject.config = this;
    return rtnObject;
  }
}