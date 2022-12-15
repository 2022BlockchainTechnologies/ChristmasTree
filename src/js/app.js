App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load pets.
    $.getJSON('../decorations.json', function (data) {
      var decoRow = $('#decoRow')
      var decoTemplate = $('#decoTemplate')
      console.log(data)

      for (i = 0; i < data.length; i++) {
        decoTemplate.find('.deco-id').text(data[i].id)
        decoTemplate.find('.deco-name').text(data[i].name)
        decoTemplate.find('.deco-price').text(data[i].price)
        decoTemplate.find('.btn-buy').attr('data-price', data[i].priceFloat)
        decoTemplate.find('.btn-buy').attr('data-id', data[i].id)

        decoRow.append(decoTemplate.html())
      }
    })

    return await App.initWeb3()
  },

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum
      try {
        // Request account access
        await window.ethereum.enable()
      } catch (error) {
        // User denied account access...
        console.error('User denied account access')
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }
    web3 = new Web3(App.web3Provider)

    return App.initContract()
  },

  initContract: function () {
    $.getJSON('christmasTree.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var christmasTreeArtifact = data
      App.contracts.christmasTree = TruffleContract(christmasTreeArtifact)

      // Set the provider for our contract
      App.contracts.christmasTree.setProvider(App.web3Provider)

      // Use our contract to retrieve and mark the adopted pets
      return App.markOwned()
    })

    return App.bindEvents()
  },

  bindEvents: function () {
    $(document).on('click', '.btn-buy', App.buyDeco)
    $(document).on('click', '.btn-test', App.test)
  },

  markOwned: function () {
    var cTreeInstance

    App.contracts.christmasTree
      .deployed()
      .then(function (instance) {
        cTreeInstance = instance

        return cTreeInstance.ownedDecorations.call()
      })
      .then(function (ownedString) {
        let image = 'images/tree'
        if (ownedString != undefined) {
          if (ownedString.includes('Lametta')) {
            $('.panel-deco').eq(0).find('button').text('Owned').attr('disabled', true)
            image += '0'
          }
          if (ownedString.includes('Lights')) {
            $('.panel-deco').eq(1).find('button').text('Owned').attr('disabled', true)
            image += '1'
          }
          if (ownedString.includes('Ornamet')) {
            $('.panel-deco').eq(2).find('button').text('Owned').attr('disabled', true)
            image += '2'
          }
          if (ownedString.includes('Chocolate')) {
            $('.panel-deco').eq(3).find('button').text('Owned').attr('disabled', true)
            image += '3'
          }
          if (ownedString.includes('Star')) {
            $('.panel-deco').eq(4).find('button').text('Owned').attr('disabled', true)
            image += '4'
          }
        }
        image += '.jpg'
        const tree = $('#tree')
        console.log(image)
        tree.find('img').attr('src', image)
      })
      .catch(function (err) {
        console.log(err.message)
      })
  },

  buyDeco: function (event) {
    event.preventDefault()

    var decoId = parseInt($(event.target).data('id'))
    var price = parseInt($(event.target).data('price'))

    var cTreeInstance

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error)
      }

      var account = accounts[0]

      App.contracts.christmasTree
        .deployed()
        .then(function (instance) {
          cTreeInstance = instance

          // Execute adopt as a transaction by sending account
          return cTreeInstance.buyDecoration(decoId, { from: account, value: price })
        })
        .then(function (result) {
          return App.markOwned()
        })
        .catch(function (err) {
          console.log(err.message)
        })
    })
  },
}

$(function () {
  $(window).load(function () {
    App.init()
  })
})
