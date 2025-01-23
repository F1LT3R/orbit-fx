const $boxes = document.querySelectorAll('.box')

const modules = {}

let lastModule = null
const stopLastModule = () => {
    if (lastModule) {
        modules[lastModule].stop()
    }
}

$boxes.forEach(($box) => {
    $box.addEventListener('click', () => {
        const animationName = $box.getAttribute('data-animation')

        const filePath = `/animations/${animationName}.mjs`
        console.log(filePath)

        const existingModule = modules[animationName]

        // Play previously loaded animation if already loaded
        if (existingModule) {
            stopLastModule()
            existingModule.play()
            lastModule = animationName
            return
        }

        // Dynamically import and play animation if not yet loaded
        import(filePath).then((module) => {
            stopLastModule()

            modules[animationName] = module
            lastModule = animationName

            module.play()
        })
    })
})
