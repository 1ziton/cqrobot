/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-10-17 15:35:05
 * @description: gitlab mr request 相关自动化操作
 */

const { request, handlePromise } = require('./fetch');
const { getProjectIdByName } = require('./project');
const facecode = require('../facecode');

/**
 * MR合并
 * @param {*} projectId
 * @param {*} sourceBranch
 * @param {*} targetBranch
 * @param {*} qq 申请自动合并MR的人QQ
 */
async function mrRequest(projectId, sourceBranch, targetBranch, qq) {
  const title = `chore: merge ${sourceBranch} to ${targetBranch} by Robot`;
  const description = `
    MR 自动创建人qq:${qq}
    `;
  const createMrUrl = `projects/${projectId}/merge_requests?source_branch=${sourceBranch}&target_branch=${targetBranch}&title=${title}&description=${description}`;
  const [mrErr, mrResult] = await handlePromise(request(createMrUrl));
  // 创建MR 失败，可能是已经有重复未合并的MR在
  if (mrErr) {
    const text = mrErr.message[0];
    const errorMsg = `操作失败：${text}`;
    const sidx = text.indexOf('["') + 2;
    const eidx = text.indexOf('"]');
    const title = text.substring(sidx, eidx);
    // 获取这个未合并的MR
    const [getMrErr, list = []] = await handlePromise(
      request(`projects/${projectId}/merge_requests?state=opened`, 'GET')
    );
    // console.log(list);
    if (list.length) {
      const arr = list.filter(mr => mr.title === title);
      if (!arr.length) {
        return errorMsg;
      }
      const mrobj = arr[0];
      if (!mrobj.merge_status) {
        console.log(mrobj);
        const [e, r] = await handlePromise(
          deleteNoChangeMr(mrobj, sourceBranch, targetBranch)
        );
        return r;
      }
      const [aerr, ares] = await handlePromise(
        acceptMr(
          mrobj,
          `检查到MR已存在(mriid: ${mrobj.iid})，并自动合并成功，mr_url：${
            mrobj['web_url']
          }`
        )
      );
      return ares;
    }
    return errorMsg;
  }

  if (Number(mrResult.changes_count) > 0) {
    console.log(2222);
    const [aerr, ares] = await handlePromise(acceptMr(mrResult));
    // console.log('ares=', ares);
    return ares;
  } else {
    // 此MR没有变更，没必要合并
    console.log(mrResult)
    const [e, r] = await handlePromise(
      deleteNoChangeMr(mrResult, sourceBranch, targetBranch)
    );
    return r;
  }
}

async function acceptMr(mrobj, msg) {
  // 得到未合并MR url地址告知
  const [acceptErr, acceptRes] = await handlePromise(
    request(
      `projects/${mrobj.project_id}/merge_requests/${mrobj.iid}/merge`,
      'PUT'
    )
  );
  console.log(acceptErr, acceptRes);
  if (acceptErr) {
    return `合并失败，查看详细原因mr_url：${mrobj['web_url']}`;
  }
  if (msg) {
    console.log('44444');
    return msg;
  }
  console.log('666666');
  return `MR自动合并成功！, url：${mrobj.web_url}`;
}

async function deleteNoChangeMr(mrResult, sourceBranch, targetBranch) {
  // console.log(mrResult);
  const [delMrErr, deleteResult = []] = await handlePromise(
    request(
      `projects/${mrResult.project_id}/merge_requests/${mrResult.iid}`,
      'DELETE'
    )
  );
  if (!delMrErr) {
    return `检测到分支${sourceBranch}与${targetBranch}没有代码变更，无需合并，已删除MR`;
  }
  return `MR操作失败`;
}

async function autoMr(projectName, sourceBranch, targetBranch, qq) {
  const [err, projectId] = await handlePromise(getProjectIdByName(projectName));
  console.log(err);
  if (projectId) {
    const result = await mrRequest(projectId, sourceBranch, targetBranch, qq);
    return result;
  }
  return `${facecode.question} 没有找到 ${projectName} 需要检查的服务环境，管理员没有维护`;
}

module.exports = {
  autoMr
};

autoMr('wiki', 'master', 'dev', '11111').then(json => console.log(json));
